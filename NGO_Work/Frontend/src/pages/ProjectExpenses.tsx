import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { format } from 'date-fns';
import { Calendar, Receipt, Info, CheckCircle, ArrowRight, Search } from 'lucide-react';

const ProjectExpenses: React.FC = () => {
  // State
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Queries
  const { data: expenses, isLoading } = trpc.expense.getExpenses.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Filter calculations
  const filteredExpenses = expenses?.filter((exp) => {
    const matchSearch = exp.expenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        exp.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchSearch) return false;
    
    const date = new Date(exp.createdAt);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (date < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (date > end) return false;
    }
    return true;
  });

  // Calculate total from filtered list
  const totalExpenses = filteredExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) ?? 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);
  };

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      {/* Banner */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-5xl md:text-6xl font-extrabold tracking-tight">Project Expenses</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Financial Transparency Report: Real-time public tracking of all organization outflows.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container-main max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-semibold">Loading expenditure report...</div>
        ) : (
          <div className="space-y-8">
            {/* Transparency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#e67e22] to-[#c0392b] text-white p-6 rounded-2xl shadow-lg md:col-span-2 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <Receipt className="w-40 h-40" />
                </div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-orange-100">
                  {startDate || endDate ? "Filtered Expenditure" : "Total Collective Expenditure"}
                </h3>
                <p className="text-3xl md:text-4xl font-black mt-2">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-orange-200 mt-2">Sum of all tracked funds applied directly to NGO activities and programs.</p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Transparency Standard</h4>
                    <p className="text-xs text-gray-500 mt-1">Every transaction is logged with verified purchase receipts and reasons.</p>
                  </div>
                </div>
                <div className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg font-bold mt-4 flex items-center gap-1 w-max">
                  100% Public Audit Verified
                </div>
              </div>
            </div>

            {/* Filter and Table Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#e67e22]" /> Detailed Expenditure Log
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-xs w-full focus:outline-none focus:border-[#e67e22] bg-white text-gray-700"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>From:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#e67e22] bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>To:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#e67e22] bg-white"
                      />
                    </div>
                    {(startDate || endDate || searchQuery) && (
                      <button
                        onClick={() => { setStartDate(""); setEndDate(""); setSearchQuery(""); }}
                        className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 pl-6">Date</th>
                      <th className="p-4">Expense Type</th>
                      <th className="p-4">Reason / Purpose</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center pr-6">Receipt Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {!filteredExpenses || filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                          No expense logs available matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 pl-6 text-gray-500 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(new Date(exp.createdAt), "dd-MM-yyyy")}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-[#061941]">{exp.expenseType}</td>
                          <td className="p-4 text-gray-600 max-w-sm truncate" title={exp.reason}>
                            {exp.reason}
                          </td>
                          <td className="p-4 font-black text-right text-gray-900 whitespace-nowrap">
                            {formatCurrency(parseFloat(exp.amount))}
                          </td>
                          <td className="p-4 text-center pr-6">
                            {exp.imageUrl ? (
                              <button
                                onClick={() => setSelectedReceipt(exp.imageUrl!)}
                                className="inline-flex items-center gap-1.5 text-xs text-[#e67e22] hover:text-[#d35400] font-bold hover:underline"
                              >
                                View Receipt <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 italic">None Provided</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Custom Modal overlay for receipt view */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-xl w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#e67e22]" /> Expense Receipt Proof
            </h3>
            <div className="border border-gray-100 rounded-xl bg-slate-50 flex items-center justify-center p-2">
              <img
                src={selectedReceipt}
                alt="Receipt Copy"
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectExpenses;
