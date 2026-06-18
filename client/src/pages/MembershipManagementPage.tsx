import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function MembershipManagementPage() {
  const { user } = useAuth();
  const [membershipType, setMembershipType] = useState("regular");
  const [referralCode, setReferralCode] = useState("");

  // Queries
  const { data: pendingData, refetch: refetchPending } = trpc.membership.getPending.useQuery(
    { page: 1, pageSize: 1000 },
    { enabled: user?.role === "admin" }
  );
  const { data: activeData } = trpc.membership.getActive.useQuery({ page: 1, pageSize: 1000 });
  const { data: myMembership } = trpc.membership.getMyMembership.useQuery();

  // Mutations
  const registerMutation = trpc.membership.register.useMutation({
    onSuccess: (data) => {
      toast.success(`Membership registered! Number: ${data.membershipNumber}`);
      setMembershipType("regular");
      setReferralCode("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const approveMutation = trpc.membership.approve.useMutation({
    onSuccess: () => {
      toast.success("Membership approved!");
      refetchPending();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const rejectMutation = trpc.membership.reject.useMutation({
    onSuccess: () => {
      toast.success("Membership rejected!");
      refetchPending();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const renewMutation = trpc.membership.renew.useMutation({
    onSuccess: () => {
      toast.success("Membership renewed!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleRegister = () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    registerMutation.mutate({
      membershipType: "regular" as "regular" | "lifetime",
      referredBy: referralCode || undefined,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* My Membership Card */}
        {!user?.role || user.role === "user" ? (
          <Card>
            <CardHeader>
              <CardTitle>My Membership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myMembership ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Membership Number</p>
                    <p className="font-semibold">{myMembership.membershipNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold capitalize">{myMembership.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold capitalize">{myMembership.membershipType}</p>
                  </div>
                  {(myMembership.status === "active" || myMembership.status === "expired") && (
                    <div className="pt-2">
                      {myMembership.status === "expired" && (
                        <div className="bg-red-50 text-red-600 p-2 text-xs mb-3 border border-red-200 rounded">
                          Your membership has expired! Please renew to continue receiving updates and messages.
                        </div>
                      )}
                      <Button onClick={() => renewMutation.mutate()} className="w-full" variant={myMembership.status === "expired" ? "default" : "outline"}>
                        {myMembership.status === "expired" ? "Renew Membership Now" : "Renew Early"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Register for membership to get started</p>

                  <div>
                    <label className="text-sm font-medium">Referral Code (Optional)</label>
                    <Input
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code"
                    />
                  </div>
                  <Button onClick={handleRegister} className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Registering..." : "Register Membership"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Active Members Count */}
        <Card>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeData?.items?.length || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Total active memberships</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Section */}
      {user?.role === "admin" && (
        <>
          {/* Pending Memberships */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Memberships ({pendingData?.items?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingData?.items && pendingData.items.length > 0 ? (
                <div className="space-y-4">
                  {pendingData.items.map((member) => (
                    <div key={member.id} className="border p-4 rounded-lg bg-gray-50/50">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Applicant Name</p>
                          <p className="font-semibold text-gray-900">{member.name || "Anonymous"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Reg. Number / Type</p>
                          <p className="font-semibold text-gray-900">
                            {member.membershipNumber} <span className="text-xs text-gray-500 font-normal capitalize">({member.membershipType})</span>
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400">Email:</span> {member.email || "N/A"}
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span> {member.phone || "N/A"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate({ membershipId: member.id })}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate({ membershipId: member.id })}
                          disabled={rejectMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No pending memberships</p>
              )}
            </CardContent>
          </Card>

          {/* Active Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              {activeData?.items && activeData.items.length > 0 ? (
                <div className="space-y-2">
                  {activeData.items.map((member) => (
                    <div key={member.id} className="border-b pb-2 last:border-b-0">
                      <p className="font-semibold">{member.membershipNumber}</p>
                      <p className="text-sm text-gray-500 capitalize">{member.membershipType}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active members</p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <footer className="w-full py-4 text-center mt-8">
        <p className="text-gray-600 text-xs mb-1">
          Â© 2026 NGO Management System. All rights reserved.
        </p>
        <p className="text-gray-400 text-[10px]">Made by Star Marketing</p>
      </footer>
    </div>
  );
}

