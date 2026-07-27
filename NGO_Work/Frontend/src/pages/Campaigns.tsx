import React from 'react';
import { trpc } from '../lib/trpc';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const Campaigns: React.FC = () => {
  const { data: campaigns, isLoading } = trpc.campaign.getActive.useQuery();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const joinVolunteerMutation = trpc.campaign.joinVolunteer.useMutation({
    onSuccess: () => {
      toast.success("Successfully registered as a volunteer for this campaign!");
      utils.campaign.getActive.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to join campaign as a volunteer.");
    },
  });

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10 px-4">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight">Active Campaigns</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl font-medium">
            Your contributions help us change lives. Explore our active funding campaigns and volunteering drives below.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto min-h-[40vh]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const isVolunteer = campaign.campaignType === "volunteer";
              
              const goalAmount = parseFloat(campaign.goalAmount as string) || 0;
              const raisedAmount = parseFloat(campaign.raisedAmount as string) || 0;
              const percentage = goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;

              const targetVols = campaign.targetVolunteers || 0;
              const joinedVols = campaign.volunteerCount || 0;
              const volPercentage = targetVols > 0 ? Math.min((joinedVols / targetVols) * 100, 100) : 0;

              return (
                <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                  <Link to={`/campaigns/${campaign.id}`} className="bg-gray-100 h-48 w-full relative overflow-hidden flex items-center justify-center cursor-pointer group">
                    {campaign.campaignImage ? (
                      <img 
                        src={campaign.campaignImage} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-gray-300 group-hover:scale-105 transition-transform duration-500">
                        {isVolunteer ? 'group' : 'volunteer_activism'}
                      </span>
                    )}
                    <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm ${
                      isVolunteer ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isVolunteer ? 'Volunteering' : 'Donation Campaign'}
                    </span>
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/campaigns/${campaign.id}`} className="hover:text-secondary transition-colors">
                      <h3 className="text-xl font-bold text-primary mb-2">{campaign.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{campaign.description}</p>
                    
                    {isVolunteer ? (
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-purple-700">{joinedVols} Joined</span>
                          <span className="text-gray-500">Target: {targetVols} Volunteers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${volPercentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{volPercentage.toFixed(0)}% Recruited</p>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-secondary">₹{raisedAmount.toLocaleString()} raised</span>
                          <span className="text-gray-500">Goal: ₹{goalAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{percentage.toFixed(0)}% Funded</p>
                      </div>
                    )}

                    {isVolunteer ? (
                      <button 
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error("Please login to register as a volunteer.");
                            navigate('/login');
                            return;
                          }
                          joinVolunteerMutation.mutate({ campaignId: campaign.id });
                        }}
                        disabled={joinVolunteerMutation.isPending}
                        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors mt-auto disabled:opacity-50"
                      >
                        {joinVolunteerMutation.isPending ? 'Joining...' : 'Volunteer Now'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#001b54] transition-colors mt-auto"
                      >
                        Donate Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">healing</span>
            <h3 className="text-xl font-bold text-gray-800">No Active Campaigns</h3>
            <p className="text-gray-500 mt-2">All our goals have been met! Please check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Campaigns;
