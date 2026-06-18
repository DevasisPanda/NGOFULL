import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

const ViewBeneficiary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const utils = trpc.useUtils();

  const { data: beneficiaries, isLoading, isError } = trpc.beneficiary.search.useQuery({
    query: searchQuery,
    category: selectedCategory,
  });

  const helpDirectlyMutation = trpc.beneficiary.helpDirectly.useMutation({
    onSuccess: (res) => {
      toast.success(`Direct contribution recorded! Receipt: ${res.receiptNumber}`);
      setIsHelpModalOpen(false);
      // Reset form
      setDonorName('');
      setDonorEmail('');
      setDonorPhone('');
      setAmount('');
      setTransactionId('');
      // Invalidate queries
      utils.beneficiary.search.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to record contribution.");
    }
  });

  // Help Modal State
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedBene, setSelectedBene] = useState<any | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleOpenHelp = (bene: any) => {
    setSelectedBene(bene);
    setIsHelpModalOpen(true);
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBene) return;

    const amtVal = parseFloat(amount);
    if (isNaN(amtVal) || amtVal <= 0) {
      toast.error("Please enter a valid amount to contribute.");
      return;
    }

    helpDirectlyMutation.mutate({
      beneficiaryId: selectedBene.id,
      amount: amtVal,
      donorName,
      donorEmail: donorEmail || undefined,
      donorPhone: donorPhone || undefined,
      transactionId: transactionId || undefined,
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-24 font-['Plus_Jakarta_Sans']">
      {/* Banner */}
      <section className="bg-[#061941] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-[-30%] left-[-10%] w-[350px] h-[350px] bg-[#fed813] rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-secondary text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#fed813]">
            Our Active Beneficiaries
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Review requirements, see how donations will be executed, and make direct bank/UPI transfers to assist individuals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center w-full mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mt-[-40px] relative z-20">
          <h2 className="text-[#061941] text-2xl font-bold mb-8">Search Beneficiaries</h2>
          
          {/* Controls Bar */}
          <div className="w-full flex flex-wrap gap-4 items-center justify-center mb-8 pb-8 border-b border-gray-100">
            {/* Search Input */}
            <div className="flex-grow min-w-[280px] max-w-md relative">
              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent text-sm bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-56 relative">
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941] focus:border-transparent text-sm bg-white appearance-none pr-10 font-semibold text-gray-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="education">Education Support</option>
                <option value="health">Healthcare Assistance</option>
                <option value="livelihood">Livelihood & Employment</option>
                <option value="emergency">Emergency Relief</option>
                <option value="other">Other Assistance</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
            </div>

            {/* Clear Button */}
            <button 
              onClick={handleClear}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>

          {/* Results Grid - Post Style */}
          {isLoading ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-white space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-[280px] bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-red-500 py-12 text-lg text-center w-full">
              Failed to load beneficiaries. Please try again.
            </div>
          ) : !beneficiaries || beneficiaries.length === 0 ? (
            <div className="text-gray-400 py-16 text-lg text-center w-full">
              <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">diversity_3</span>
              No active beneficiaries matching your filters.
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              {beneficiaries.map((b) => {
                const requested = parseFloat(b.requestedAmount || "0");
                const collected = parseFloat(b.collectedAmount || "0");
                const percent = requested > 0 ? Math.min(100, Math.round((collected / requested) * 100)) : 0;

                return (
                  <div 
                    key={b.id} 
                    className="border border-gray-100 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-5 flex items-center justify-between border-b border-gray-50 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase shadow-inner text-sm shrink-0">
                          {b.name.slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-gray-900 leading-tight">{b.name}</h3>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Category: {b.category}
                          </span>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Approved
                      </span>
                    </div>

                    {/* Image Block */}
                    <div className="w-full aspect-[4/3] bg-gray-50 relative overflow-hidden border-b border-gray-100">
                      {b.profileImage ? (
                        <img 
                          src={b.profileImage} 
                          alt={b.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                          <span className="material-symbols-outlined text-6xl">person</span>
                          <span className="text-xs mt-2 font-medium">No Image Uploaded</span>
                        </div>
                      )}
                    </div>

                    {/* Description / Help Block */}
                    <div className="p-5 flex-grow space-y-4">
                      {/* Notes / Situation */}
                      {b.notes && (
                        <div className="bg-[#fcfdff] p-4 rounded-xl border border-slate-100 text-sm leading-relaxed text-gray-700">
                          <strong className="text-[#061941] block mb-1 font-bold text-xs uppercase tracking-wider">
                            Help Required:
                          </strong>
                          <p className="text-slate-600 line-clamp-4">{b.notes}</p>
                        </div>
                      )}

                      {/* Recipient Details & Events */}
                      <div className="grid grid-cols-1 gap-2 text-xs font-medium text-gray-500">
                        {b.targetEmail && (
                          <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                            <span className="material-symbols-outlined text-gray-400 text-sm shrink-0">mail</span>
                            <span><strong>Collecting For:</strong> {b.targetEmail}</span>
                          </div>
                        )}
                        {b.executionPlan && (
                          <div className="flex flex-col gap-1 p-2 bg-amber-50/50 border border-amber-100 rounded-lg text-slate-700">
                            <span className="flex items-center gap-1.5 font-bold text-[10px] text-amber-800 uppercase tracking-wider">
                              <span className="material-symbols-outlined text-sm">event</span> Execution Plan / Event
                            </span>
                            <p className="text-slate-600 leading-normal pl-5">{b.executionPlan}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fundraising Progress Footer */}
                    <div className="p-5 pt-0 mt-auto border-t border-gray-50 bg-gray-50/50">
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span>Goal progress ({percent}%)</span>
                          <span>₹{collected.toLocaleString()} raised of ₹{requested.toLocaleString()}</span>
                        </div>
                        {/* Progress bar container */}
                        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Help Directly Button */}
                      <button 
                        onClick={() => handleOpenHelp(b)}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-[#fed813] hover:bg-[#ebd41c] text-[#061941] py-3 rounded-xl font-bold shadow transition-colors text-sm hover:shadow-md"
                      >
                        <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                        Help Directly (Peer-to-Peer Transfer)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Contact CTA */}
        <div className="flex justify-center mb-8">
          <Link to="/contact" className="bg-[#061941] text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-black transition-all shadow-lg hover:shadow-xl">
            Contact Us Now <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Direct Peer Help Modal */}
      {isHelpModalOpen && selectedBene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all my-8">
            {/* Modal Header */}
            <div className="bg-[#061941] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400">volunteer_activism</span>
                <div>
                  <h3 className="font-extrabold text-lg text-[#fed813]">Direct Help Transfer</h3>
                  <p className="text-[11px] text-gray-300 mt-0.5">Direct peer-to-peer contribution for {selectedBene.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleHelpSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800 mb-1">Peer Transfer Disclaimer:</p>
                This donation will be transferred directly to the beneficiary's family / program. The NGO tracks this transfer to log against the recipient's requirement and does not subtract it from administrative direct expenses.
              </div>

              {/* Donor Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="donorName">Donor Name *</label>
                <input 
                  id="donorName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941]"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="donorEmail">Email Address (Optional)</label>
                  <input 
                    id="donorEmail"
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941]"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="donorPhone">Phone Number (Optional)</label>
                  <input 
                    id="donorPhone"
                    type="tel"
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941]"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Amount & TxID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="helpAmount">Transfer Amount (INR) *</label>
                  <input 
                    id="helpAmount"
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="transactionId">UPI/Transaction ID (Optional)</label>
                  <input 
                    id="transactionId"
                    type="text"
                    placeholder="TxRef No."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941]"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsHelpModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={helpDirectlyMutation.isPending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow transition disabled:opacity-50"
                >
                  {helpDirectlyMutation.isPending ? "Recording..." : "Confirm Contribution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBeneficiary;
