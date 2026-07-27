import React, { useState, useCallback } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { trackEvent } from '../utils/analytics';

interface DonationWidgetProps {
  purpose: string;
  campaignId?: number;
  presetTiers?: any;
}

type PaymentStep = 'form' | 'processing' | 'success' | 'error';
type PaymentType = 'one_time' | 'monthly';
type SubscriptionInterval = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

const normalizeNumerals = (str: string): string => {
  const numeralsMap: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
  };
  return str.replace(/[०-९૦-૯]/g, (char) => numeralsMap[char] || char);
};

const PRESET_TIERS = [
  { id: 'lunch', label: '1 Lunch', amount: 300, icon: 'lunch_dining', description: 'Provide a hot nutritious meal' },
  { id: 'dinner', label: '1 Dinner', amount: 400, icon: 'dinner_dining', description: 'Provide a wholesome dinner' },
  { id: 'edu', label: 'Education Support', amount: 1200, icon: 'school', description: 'Sponsor books & stationery' },
  { id: 'custom', label: 'Custom Support', amount: '', icon: 'volunteer_activism', description: 'Enter any donation amount' }
];

export const DonationWidget: React.FC<DonationWidgetProps> = ({ purpose, campaignId, presetTiers }) => {
  const tiers = presetTiers && Array.isArray(presetTiers) && presetTiers.length > 0
    ? [
        ...presetTiers.map((t: any, idx: number) => ({
          id: t.id || `tier_${idx}`,
          label: t.label,
          amount: t.amount,
          icon: idx === 0 ? 'cookie' : idx === 1 ? 'favorite' : 'spa',
          description: t.description || 'Support this package tier'
        })),
        { id: 'custom', label: 'Custom Support', amount: '', icon: 'volunteer_activism', description: 'Enter any donation amount' }
      ]
    : PRESET_TIERS;
  const [form, setForm] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    panNumber: '',
  });

  const [paymentType, setPaymentType] = useState<PaymentType>('one_time');
  const [intervalType, setIntervalType] = useState<SubscriptionInterval>('monthly');
  const [selectedTier, setSelectedTier] = useState<string>('custom');
  
  const [step, setStep] = useState<PaymentStep>('form');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // tRPC Mutations
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

  const createSubscription = trpc.payment.createSubscription.useMutation({
    onError: (error) => {
      setStep('error');
      setPaymentError(error.message);
      toast.error(error.message);
    },
  });

  const verifySubscription = trpc.payment.verifySubscription.useMutation({
    onError: (error) => {
      setStep('error');
      setPaymentError(error.message);
      toast.error(error.message);
    },
  });

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'amount') {
      setSelectedTier('custom');
    }
  };

  const handleSelectTier = (tierId: string, tierAmount: number | string) => {
    setSelectedTier(tierId);
    setForm(prev => ({ ...prev, amount: tierAmount.toString() }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanAmountStr = normalizeNumerals(form.amount);
    const amount = parseFloat(cleanAmountStr);
    
    if (!amount || amount < 1) {
      toast.error('Please enter a valid donation amount (minimum ₹1).');
      return;
    }

    if (!form.donorName || !form.donorEmail) {
      toast.error('Please fill in your name and email address.');
      return;
    }

    setStep('processing');
    
    const activeTier = tiers.find(t => t.id === selectedTier);
    const paymentLabel = activeTier && activeTier.id !== 'custom'
      ? `${activeTier.label} : ${purpose}`
      : purpose;

    trackEvent('donation_initiated', { 
      amount, 
      purpose: paymentLabel, 
      type: paymentType,
      interval: paymentType === 'monthly' ? intervalType : undefined
    });

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      setStep('form');
      return;
    }

    const cleanPhone = form.donorPhone ? normalizeNumerals(form.donorPhone) : undefined;

    if (paymentType === 'one_time') {
      // 1. One-time Order Flow
      createOrder.mutate(
        {
          amount,
          currency: 'INR',
          donorName: form.donorName,
          donorEmail: form.donorEmail,
          donorPhone: cleanPhone || undefined,
          purpose: paymentLabel,
          campaignId,
        },
        {
          onSuccess: (order) => {
            const options = {
              key: order.keyId,
              amount: order.amount,
              currency: order.currency,
              name: 'Valmiki Samaj Charitable Trust',
              description: `One-time Donation: ${paymentLabel}`,
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
                      toast.success('Payment successful! Thank you.');
                    },
                  }
                );
              },
              prefill: {
                name: form.donorName,
                email: form.donorEmail,
                contact: cleanPhone,
              },
              theme: {
                color: '#00123a',
              },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (resp: any) {
              setStep('error');
              setPaymentError(resp.error.description || 'Payment failed.');
              toast.error(resp.error.description || 'Payment failed.');
            });
            rzp.open();
          },
        }
      );
    } else {
      // 2. Subscription Flow
      createSubscription.mutate(
        {
          amount,
          donorName: form.donorName,
          donorEmail: form.donorEmail,
          donorPhone: cleanPhone || undefined,
          purpose: paymentLabel,
          campaignId,
          intervalType,
        },
        {
          onSuccess: (subscription) => {
            const options = {
              key: subscription.keyId,
              subscription_id: subscription.subscriptionId,
              name: 'Valmiki Samaj Charitable Trust',
              description: `${intervalType.toUpperCase()} Subscription: ${paymentLabel}`,
              handler: function (response: any) {
                verifySubscription.mutate(
                  {
                    razorpaySubscriptionId: response.razorpay_subscription_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                  {
                    onSuccess: (data) => {
                      setReceiptNumber(data.receiptNumber);
                      setStep('success');
                      toast.success('Subscription active! Thank you.');
                    },
                  }
                );
              },
              prefill: {
                name: form.donorName,
                email: form.donorEmail,
                contact: cleanPhone,
              },
              theme: {
                color: '#00123a',
              },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (resp: any) {
              setStep('error');
              setPaymentError(resp.error.description || 'Subscription initialization failed.');
              toast.error(resp.error.description || 'Subscription initialization failed.');
            });
            rzp.open();
          },
        }
      );
    }
  };

  if (step === 'processing') {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-12 h-12 border-4 border-t-secondary border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mb-4"></div>
        <p className="text-primary font-bold text-lg">Processing Payment</p>
        <p className="text-gray-400 text-sm text-center mt-2 max-w-[200px]">
          Please do not refresh the page or close the window.
        </p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center min-h-[450px]">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-emerald-600 text-4xl font-extrabold">check</span>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
          Your support for <strong>{purpose}</strong> has been successfully registered.
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 w-full mb-6">
          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Receipt Number</span>
          <span className="text-sm font-mono font-bold text-primary">{receiptNumber}</span>
        </div>
        <button
          onClick={() => {
            setForm({ donorName: '', donorEmail: '', donorPhone: '', amount: '', panNumber: '' });
            setSelectedTier('custom');
            setStep('form');
          }}
          className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary/95 transition-colors cursor-pointer text-sm w-full"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center min-h-[450px]">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-rose-600 text-4xl font-extrabold">warning</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Payment Failed</h3>
        <p className="text-rose-500 text-xs font-semibold mb-6 max-w-[240px]">
          {paymentError || 'An unexpected error occurred during verification.'}
        </p>
        <button
          onClick={() => setStep('form')}
          className="bg-secondary text-primary font-bold px-6 py-3 rounded-full hover:brightness-[1.03] transition-all cursor-pointer text-sm w-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
      
      <h3 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary fill-current">favorite</span>
        Support Cause
      </h3>
      <p className="text-gray-500 text-xs mb-6 leading-relaxed">
        Sponsor a specific package or input a custom amount below to register your support.
      </p>

      {/* Tabs for One-time vs Recurring */}
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl mb-6 border border-gray-100">
        <button
          type="button"
          onClick={() => setPaymentType('one_time')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            paymentType === 'one_time'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-400 hover:text-primary bg-transparent'
          }`}
        >
          One-Time
        </button>
        <button
          type="button"
          onClick={() => setPaymentType('monthly')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            paymentType === 'monthly'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-400 hover:text-primary bg-transparent'
          }`}
        >
          Recurring Donation
        </button>
      </div>

      {/* Cause Package Cards Selection */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
          Select Cause Package
        </label>
        <div className="grid grid-cols-2 gap-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => handleSelectTier(tier.id, tier.amount)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group cursor-pointer h-24 ${
                selectedTier === tier.id
                  ? 'border-secondary bg-amber-50/20 shadow-sm ring-1 ring-secondary'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`material-symbols-outlined text-[20px] ${
                  selectedTier === tier.id ? 'text-secondary' : 'text-gray-400 group-hover:text-primary'
                }`}>
                  {tier.icon}
                </span>
                {tier.amount && (
                  <span className="text-xs font-bold text-primary">₹{tier.amount}</span>
                )}
              </div>
              <div>
                <span className="block text-xs font-bold text-primary leading-tight">{tier.label}</span>
                <span className="block text-[9px] text-gray-400 line-clamp-1 mt-0.5 leading-none">{tier.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        {/* Recurring frequency dropdown (only visible when Recurring is active) */}
        {paymentType === 'monthly' && (
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Donation Frequency
            </label>
            <select
              value={intervalType}
              onChange={(e) => setIntervalType(e.target.value as SubscriptionInterval)}
              className="w-full h-11 px-4 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:border-secondary transition-colors font-semibold text-primary"
            >
              <option value="monthly">Monthly Support</option>
              <option value="quarterly">Quarterly Support (Every 3 months)</option>
              <option value="half_yearly">Half-Yearly Support (Every 6 months)</option>
              <option value="yearly">Annually Support (Every year)</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="donorName"
            required
            value={form.donorName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full h-11 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="donorEmail"
            required
            value={form.donorEmail}
            onChange={handleChange}
            placeholder="johndoe@example.com"
            className="w-full h-11 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="donorPhone"
              value={form.donorPhone}
              onChange={handleChange}
              placeholder="10-digit number"
              pattern="[0-9]{10}"
              className="w-full h-11 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              required
              min="1"
              disabled={selectedTier !== 'custom'}
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount in ₹"
              className="w-full h-11 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-secondary transition-colors font-bold text-primary disabled:bg-gray-50/50 disabled:text-primary/75"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createOrder.isPending || createSubscription.isPending}
          className="w-full bg-secondary text-primary font-extrabold py-3.5 px-6 rounded-full shadow-sm hover:shadow-md hover:brightness-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center text-xs uppercase tracking-wider cursor-pointer mt-4"
        >
          <span className="material-symbols-outlined text-[18px] fill-current">favorite</span>
          {paymentType === 'one_time' ? 'Donate Now' : 'Start Subscription'}
        </button>
      </form>
    </div>
  );
};
