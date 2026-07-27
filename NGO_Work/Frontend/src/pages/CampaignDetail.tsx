import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { DonationWidget } from '../components/DonationWidget';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campaignId = id ? parseInt(id, 10) : null;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: campaign, isLoading, error } = trpc.campaign.getById.useQuery(
    { id: campaignId || 0 },
    { enabled: !!campaignId }
  );

  const joinVolunteerMutation = trpc.campaign.joinVolunteer.useMutation({
    onSuccess: () => {
      toast.success("Successfully registered as a volunteer for this campaign!");
      utils.campaign.getById.invalidate({ id: campaignId || 0 });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to join campaign as a volunteer.");
    },
  });

  if (!campaignId) {
    return <Navigate to="/campaigns" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-secondary border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading campaign details...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Campaign Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          The campaign you are looking for might have been completed, closed, or doesn't exist.
        </p>
        <Link to="/campaigns" className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const isVolunteer = campaign.campaignType === "volunteer";
  const goalAmount = parseFloat(campaign.goalAmount as string) || 0;
  const raisedAmount = parseFloat(campaign.raisedAmount as string) || 0;
  
  // Fetch volunteer counts (could be retrieved from campaign object query metadata)
  const targetVols = campaign.targetVolunteers || 0;
  const joinedVols = (campaign as any).volunteerCount || 0;
  const volPercentage = targetVols > 0 ? Math.min((joinedVols / targetVols) * 100, 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header with Background */}
      <section className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main relative z-10 flex items-center px-4">
          <Link to="/campaigns" className="flex items-center text-secondary hover:text-white transition-colors font-bold">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Campaigns
          </Link>
        </div>
      </section>

      {/* Main Split Layout: Left 65% / Right 35% */}
      <div className="container-main py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image & Details (65%) */}
          <div className="w-full lg:w-[65%] space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  campaign.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isVolunteer ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isVolunteer ? 'Volunteering' : 'Donation Campaign'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mt-2 mb-3">
                {campaign.title}
              </h1>
              <p className="text-sm text-gray-400 font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Start Date: {new Date(campaign.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Proportional Image Container */}
            <div className="w-full aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-white relative group">
              {campaign.campaignImage ? (
                <img 
                  src={campaign.campaignImage} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-gray-300">
                    {isVolunteer ? 'group' : 'volunteer_activism'}
                  </span>
                </div>
              )}
            </div>

            {/* Campaign Descriptions Box */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
              {campaign.description && (
                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">info</span>
                    About Campaign
                  </h3>
                  <p className="text-gray-700 text-[16px] leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
                </div>
              )}

              {campaign.whyNeeded && (
                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">help_outline</span>
                    Why is it needed?
                  </h3>
                  <p className="text-gray-700 text-[16px] leading-relaxed whitespace-pre-wrap">{campaign.whyNeeded}</p>
                </div>
              )}

              {campaign.forWhom && (
                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">group</span>
                    Who does this benefit?
                  </h3>
                  <p className="text-gray-700 text-[16px] leading-relaxed whitespace-pre-wrap">{campaign.forWhom}</p>
                </div>
              )}

              {campaign.impact && (
                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">volunteer_activism</span>
                    Expected Impact
                  </h3>
                  <p className="text-gray-700 text-[16px] leading-relaxed whitespace-pre-wrap">{campaign.impact}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Donation Sidebar / Volunteering Widget (35%) */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-8 self-start space-y-6">
            
            {isVolunteer ? (
              // Volunteering Action Card
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-purple-600"></div>
                
                <h3 className="text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">group</span>
                  Volunteer Drive
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Join our team of dedicated volunteers to support this campaign directly on the ground.
                </p>

                {targetVols > 0 && (
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-purple-700">{joinedVols} Joined</span>
                      <span className="text-gray-400">Goal: {targetVols}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${volPercentage}%` }}></div>
                    </div>
                  </div>
                )}

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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-4 px-6 rounded-full shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  {joinVolunteerMutation.isPending ? 'Registering...' : 'Volunteer Now'}
                </button>
              </div>
            ) : (
              // Embedded Donation Widget
              <DonationWidget purpose={campaign.title} campaignId={campaign.id} presetTiers={campaign.presetTiers} />
            )}

            {/* Campaign Info Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">info</span>
                Information
              </h3>
              <div className="space-y-4">
                {!isVolunteer && (
                  <div className="flex gap-3 items-start border-b border-gray-50 pb-4">
                    <span className="material-symbols-outlined text-secondary bg-gray-50 p-2 rounded-xl text-[20px] shrink-0">
                      payments
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Goal Amount</span>
                      <span className="text-[14px] text-primary font-semibold leading-tight">₹{goalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 items-start border-b border-gray-50 pb-4">
                  <span className="material-symbols-outlined text-secondary bg-gray-50 p-2 rounded-xl text-[20px] shrink-0">
                    date_range
                  </span>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">End Date</span>
                    <span className="text-[14px] text-primary font-semibold leading-tight">
                      {new Date(campaign.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {campaign.category && (
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-secondary bg-gray-50 p-2 rounded-xl text-[20px] shrink-0">
                      category
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
                      <span className="text-[14px] text-primary font-semibold leading-tight capitalize">{campaign.category}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
