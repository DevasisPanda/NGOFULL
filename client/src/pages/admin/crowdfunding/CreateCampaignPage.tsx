import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function CreateCampaignPage() {
  const { user } = useAuth();
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    whyNeeded: "",
    forWhom: "",
    impact: "",
    goalAmount: "",
    targetVolunteers: "",
    category: "",
    campaignType: "donation" as "donation" | "volunteer",
    endDate: "", 
    campaignImage: "",
  });

  const createCampaignMutation = trpc.campaign.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Campaign created! Code: ${data.campaignCode}`);
      setNewCampaign({ 
        title: "", description: "", whyNeeded: "", forWhom: "", impact: "", 
        goalAmount: "", targetVolunteers: "", category: "", campaignType: "donation", endDate: "", campaignImage: ""
      });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.title || (newCampaign.campaignType === "donation" && !newCampaign.goalAmount) || (newCampaign.campaignType === "volunteer" && !newCampaign.targetVolunteers) || !newCampaign.endDate) {
      toast.error("Please fill in all required fields including goals and end date.");
      return;
    }
    
    createCampaignMutation.mutate({
      title: newCampaign.title,
      description: newCampaign.description,
      whyNeeded: newCampaign.whyNeeded,
      forWhom: newCampaign.forWhom,
      impact: newCampaign.impact,
      goalAmount: newCampaign.campaignType === "volunteer" ? 0 : parseFloat(newCampaign.goalAmount),
      targetVolunteers: newCampaign.campaignType === "volunteer" ? parseInt(newCampaign.targetVolunteers) : undefined,
      category: newCampaign.category,
      campaignType: newCampaign.campaignType,
      campaignImage: newCampaign.campaignImage || undefined,
      startDate: new Date(),
      endDate: new Date(newCampaign.endDate),
    });
  };

  if (user?.role !== "admin") return <div className="p-6">Access Denied</div>;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload 
            label="Campaign Cover Image" 
            value={newCampaign.campaignImage} 
            onChange={(url) => setNewCampaign({ ...newCampaign, campaignImage: url })} 
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Campaign Title</label>
              <Input
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                placeholder="e.g., Education Fund"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Campaign Type</label>
              <select
                value={newCampaign.campaignType}
                onChange={(e) => setNewCampaign({ ...newCampaign, campaignType: e.target.value as any })}
                className="w-full h-10 px-3 py-2 border rounded-md"
              >
                <option value="donation">Donation</option>
                <option value="volunteer">Volunteer Work</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {newCampaign.campaignType === "donation" ? (
              <div>
                <label className="text-sm font-medium">Goal Amount (₹)</label>
                <Input
                  type="number"
                  value={newCampaign.goalAmount}
                  onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })}
                  placeholder="Enter goal amount"
                  min="1"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium">Target Number of Volunteers</label>
                <Input
                  type="number"
                  value={newCampaign.targetVolunteers}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetVolunteers: e.target.value })}
                  placeholder="Enter number of people needed"
                  min="1"
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newCampaign.description}
              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              placeholder="Campaign overview"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Why is it needed?</label>
              <Input
                value={newCampaign.whyNeeded}
                onChange={(e) => setNewCampaign({ ...newCampaign, whyNeeded: e.target.value })}
                placeholder="The core problem"
              />
            </div>
            <div>
              <label className="text-sm font-medium">For Whom?</label>
              <Input
                value={newCampaign.forWhom}
                onChange={(e) => setNewCampaign({ ...newCampaign, forWhom: e.target.value })}
                placeholder="Target beneficiaries"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expected Impact</label>
              <Input
                value={newCampaign.impact}
                onChange={(e) => setNewCampaign({ ...newCampaign, impact: e.target.value })}
                placeholder="What will change?"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
              value={newCampaign.category}
              onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
              placeholder="e.g., Education, Health"
            />
          </div>
          <Button onClick={handleCreateCampaign} className="w-full" disabled={createCampaignMutation.isPending}>
            {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
