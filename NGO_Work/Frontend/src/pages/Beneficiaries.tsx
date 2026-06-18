import React, { useState, useRef } from 'react';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const Beneficiaries: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<'education' | 'health' | 'livelihood' | 'emergency' | 'other'>('education');
  const [notes, setNotes] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [executionPlan, setExecutionPlan] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.beneficiary.create.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCategory('education');
      setNotes('');
      setRequestedAmount('');
      setTargetEmail('');
      setExecutionPlan('');
      setBase64Image(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit application.");
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setBase64Image(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit an application.");
      return;
    }

    const goalVal = parseFloat(requestedAmount);
    if (isNaN(goalVal) || goalVal < 0) {
      toast.error("Goal amount must be a positive number.");
      return;
    }

    createMutation.mutate({
      name: fullName,
      email: email,
      phone: phone,
      address: address,
      category: category,
      notes: notes,
      profileImage: base64Image || undefined,
      requestedAmount: goalVal,
      targetEmail: targetEmail || undefined,
      executionPlan: executionPlan || undefined,
    });
  };

  return (
    <div className="flex-grow bg-[#f9fafb] pb-24 font-['Plus_Jakarta_Sans']">
      {/* Banner */}
      <section className="bg-[#061941] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-[#fed813] rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

        <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-secondary text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#fed813]">
            Apply for Beneficiary Assistance
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Are you or someone you know in need of support? Fill out the form below to apply for our NGO community assistance program.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="max-w-[720px] mx-auto px-6 mt-[-40px] relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
          
          {/* Authenticated Overlay */}
          {!isAuthenticated && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[5px] z-50 flex flex-col items-center justify-center p-8 text-center">
              <span className="material-symbols-outlined text-6xl text-rose-500 mb-4 animate-pulse">lock</span>
              <h3 className="text-2xl font-bold text-[#061941] mb-2">Member Authentication Required</h3>
              <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
                Only registered members of the Valmiki Samaj Charitable Trust can submit beneficiary assistance applications.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="/login" 
                  className="px-6 py-2.5 bg-[#061941] text-white font-bold rounded-lg hover:bg-black transition text-sm shadow-md"
                >
                  Log In
                </a>
                <a 
                  href="/register" 
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-sm border border-gray-200"
                >
                  Apply Membership
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header info */}
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-bold text-[#061941] mb-1">Application Form</h2>
              <p className="text-gray-500 text-sm">Please provide accurate contact details so our team can reach out to you.</p>
            </div>

            {/* Profile Image upload */}
            <div className="flex flex-col items-center sm:flex-row gap-5 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-white flex items-center justify-center text-gray-400">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="block text-sm font-semibold text-gray-700 mb-1">Profile Image / Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden" 
                  id="profile-upload" 
                />
                <label 
                  htmlFor="profile-upload" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-bold text-xs hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >
                  Choose File
                </label>
                <span className="block text-[11px] text-gray-400 mt-1.5">Max file size: 2MB (JPG, PNG, WebP)</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="fullName">Full Name *</label>
              <input 
                id="fullName" 
                type="text" 
                required 
                placeholder="Enter applicant's full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Contact details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">Phone Number *</label>
                <input 
                  id="phone" 
                  type="tel" 
                  required 
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">Email Address (Optional)</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="example@mail.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="category">Assistance Category *</label>
              <select 
                id="category"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white font-medium"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="education">Education Support</option>
                <option value="health">Healthcare assistance</option>
                <option value="livelihood">Livelihood & Employment</option>
                <option value="emergency">Emergency Relief</option>
                <option value="other">Other Requirements</option>
              </select>
            </div>

            {/* Requested Goal Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="requestedAmount">Requested Goal Amount (INR) *</label>
              <input 
                id="requestedAmount" 
                type="number" 
                required 
                min="0"
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
              />
            </div>

            {/* Target Recipient Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="targetEmail">Target Recipient Email (For whom collecting - Optional)</label>
              <input 
                id="targetEmail" 
                type="email" 
                placeholder="recipient@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="address">Residential Address *</label>
              <textarea 
                id="address" 
                rows={3} 
                required
                placeholder="Enter complete residential address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="notes">Why do you need assistance? (Notes / details)</label>
              <textarea 
                id="notes" 
                rows={4} 
                placeholder="Please describe your requirements or situation in detail so we can assess your application better."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Execution Plan / Events */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="executionPlan">Execution Plan / Distribution Event details (Optional)</label>
              <textarea 
                id="executionPlan" 
                rows={3} 
                placeholder="Briefly describe how this donation will be executed (e.g. funds directly paid to the school, distributed during a charity drive...)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={executionPlan}
                onChange={(e) => setExecutionPlan(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-transparent rounded-lg shadow-md text-sm font-bold text-[#061941] bg-[#fed813] hover:bg-[#ebd41c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Beneficiaries;
