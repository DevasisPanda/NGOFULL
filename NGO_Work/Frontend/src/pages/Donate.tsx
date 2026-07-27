import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { trackEvent } from '../utils/analytics';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentStep = 'form' | 'processing' | 'success' | 'error';

interface FormData {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: string;
  purpose: string;
  panNumber: string;
  campaignId?: number;
}

const normalizeNumerals = (str: string): string => {
  const numeralsMap: Record<string, string> = {
    // Hindi/Devanagari
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    // Gujarati
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
  };
  return str.replace(/[०-९૦-૯]/g, (char) => numeralsMap[char] || char);
};

const Donate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaignState = (location.state as { campaignId?: number }) || {};

  const [form, setForm] = useState<FormData>({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    purpose: '',
    panNumber: '',
    campaignId: campaignState.campaignId,
  });

  // Sync URL search parameters (amount, purpose, cause) into donation form
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlAmount = searchParams.get('amount');
    const urlPurpose = searchParams.get('purpose') || searchParams.get('cause');

    if (urlAmount || urlPurpose) {
      setForm((prev) => ({
        ...prev,
        amount: urlAmount ? urlAmount : prev.amount,
        purpose: urlPurpose ? decodeURIComponent(urlPurpose) : prev.purpose,
      }));
    }
  }, [location.search]);

  const [step, setStep] = useState<PaymentStep>('form');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const createOrder = trpc.payment.createOrder.useMutation({
    onError: (error) => {
      setStep('error');
      setPaymentError(error.message);
      toast.error(error.message);
    },
  });

  const verifyPayment = trpc.payment.verifyPayment.useMutation({
    onError: (error) => {
      setStep('error');
      setPaymentError(error.message);
      toast.error(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    trackEvent('donation_initiated', { amount: form.amount, purpose: form.purpose || 'general' });

    const cleanAmountStr = normalizeNumerals(form.amount);
    const amount = parseFloat(cleanAmountStr);
    if (!amount || amount < 1) {
      toast.error('Please enter a valid donation amount (minimum ₹1).');
      setStep('form');
      return;
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      setStep('form');
      return;
    }

    const cleanPhone = form.donorPhone ? normalizeNumerals(form.donorPhone) : undefined;

    // Create order on backend
    createOrder.mutate(
      {
        amount,
        currency: 'INR',
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donorPhone: cleanPhone || undefined,
        purpose: form.purpose || undefined,
        campaignId: form.campaignId,
      },
      {
        onSuccess: (order) => {
          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'Valmiki Samaj Charitable Trust',
            description: form.purpose
              ? `Donation for ${form.purpose}`
              : 'General Donation',
            order_id: order.orderId,
            handler: function (response: any) {
              verifyPayment.mutate(
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                {
                  onSuccess: (data) => {
                    setReceiptNumber(data.receiptNumber);
                    setStep('success');
                    toast.success('Payment successful! Thank you for your donation.');
                  },
                }
              );
            },
            prefill: {
              name: form.donorName,
              email: form.donorEmail,
              contact: form.donorPhone,
            },
            theme: {
              color: '#6f5d00',
            },
            modal: {
              ondismiss: () => {
                setStep('form');
                toast.info('Payment cancelled.');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            toast.error('Payment failed. Please try again.');
            setStep('form');
          });
          rzp.open();
        },
        onError: () => {
          // Handled by mutation onError above
        },
      }
    );
  };

  // --- SUCCESS VIEW ---
  if (step === 'success') {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden bg-[#f8f9fa]">
        <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#e2e2e2] overflow-hidden relative z-10 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#00123a] mb-2"><span>Thank You!</span></h1>
          <p className="text-[#45464e] mb-6"><span>Your generous donation has been received.</span></p>
          {receiptNumber && (
            <p className="text-sm text-[#64748b] mb-6">
              <span>Receipt No: </span><span className="font-bold text-[#00123a]">{receiptNumber}</span>
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#f7d100] hover:bg-[#e8c400] text-[#00123a] font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  // --- ERROR VIEW ---
  if (step === 'error') {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden bg-[#f8f9fa]">
        <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#e2e2e2] overflow-hidden relative z-10 p-12 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#00123a] mb-2"><span>Payment Failed</span></h1>
          <p className="text-[#45464e] mb-6"><span>{paymentError || 'Something went wrong. Please try again.'}</span></p>
          <button
            onClick={() => { setStep('form'); setPaymentError(''); }}
            className="w-full bg-[#f7d100] hover:bg-[#e8c400] text-[#00123a] font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // --- DONATION FORM ---
  const isLoading = createOrder.isPending || verifyPayment.isPending;

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden bg-[#f8f9fa]">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#f3f3f4] -z-10 skew-y-3 origin-top-left"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#fed813]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#000]/5 rounded-full blur-2xl -z-10"></div>

      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#e2e2e2] overflow-hidden relative z-10">
        {/* Header */}
        <div className="p-12 pb-6 text-center border-b border-[#e2e2e2]">
          <img
            alt="Trust Logo"
            className="w-24 h-24 mx-auto object-cover rounded-full shadow-sm mb-6 border-2 border-[#e2e2e2]"
            src="/logo.jpg"
          />
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#6f5d00] text-3xl">volunteer_activism</span>
            <h1 className="text-[24px] font-bold text-[#00123a]">Support Our<br />Mission</h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-12 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Donor Name */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="material-symbols-outlined text-[#45464e]">person</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none notranslate"
                  translate="no"
                  name="donorName"
                  placeholder="Enter Your Name *"
                  type="text"
                  value={form.donorName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="material-symbols-outlined text-[#45464e]">mail</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none"
                  name="donorEmail"
                  placeholder="Enter Your Email ID *"
                  type="email"
                  value={form.donorEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="material-symbols-outlined text-[#45464e]">call</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none notranslate"
                  translate="no"
                  name="donorPhone"
                  placeholder="Enter 10-digit Mobile Number"
                  type="tel"
                  value={form.donorPhone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Phone number must be exactly 10 digits"
                />
              </div>

              {/* Amount */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="text-[#45464e] font-bold">₹</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none notranslate"
                  translate="no"
                  name="amount"
                  placeholder="Enter Amount * (Min ₹1)"
                  type="number"
                  min="1"
                  step="1"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Purpose */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="material-symbols-outlined text-[#45464e]">volunteer_activism</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none text-[#45464e] notranslate"
                  translate="no"
                  name="purpose"
                  placeholder="Purpose / Cause of Donation (e.g. Support a Child, Education)"
                  type="text"
                  list="donation-purposes"
                  value={form.purpose}
                  onChange={handleChange}
                />
                <datalist id="donation-purposes">
                  <option value="Support a Child" />
                  <option value="Educational Kit" />
                  <option value="Nutrition Support" />
                  <option value="Paradise Child Home - Orphan Care" />
                  <option value="Education Sponsorship" />
                  <option value="Women's Empowerment" />
                  <option value="Support for Orphan Girls" />
                  <option value="Healthcare & Medical Assistance" />
                  <option value="General Welfare" />
                </datalist>
              </div>

              {/* 80G Info */}
              <div className="py-2 text-center">
                <p className="text-[14px] font-bold text-[#1a1c1c]">
                  If you want to claim Tax Deduction under Section 80G, please fill the PAN field below.
                </p>
                <p className="text-[14px] font-bold text-[#1a1c1c]">
                  यदि आप धारा 80G के अंतर्गत टैक्स छूट प्राप्त करना चाहते हैं, तो नीचे PAN नंबर भरें।
                </p>
              </div>

              {/* PAN Number */}
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="bg-[#f3f3f4] px-4 flex items-center">
                  <span className="material-symbols-outlined text-[#45464e]">badge</span>
                </div>
                <input
                  className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none notranslate"
                  translate="no"
                  name="panNumber"
                  placeholder="PAN Number (Optional)"
                  type="text"
                  value={form.panNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                translate="no"
                className="w-full flex justify-center items-center font-bold py-[14px] px-6 rounded-lg transition-colors duration-200 mt-4 bg-[#f7d100] hover:bg-[#e8c400] text-[#00123a] disabled:opacity-50 disabled:cursor-not-allowed notranslate"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#00123a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span>Donate Now</span>
                )}
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-[12px] text-[#64748b] flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
