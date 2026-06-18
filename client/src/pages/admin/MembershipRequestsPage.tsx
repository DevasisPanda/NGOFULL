import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MembershipRequestsPage() {
  const utils = trpc.useUtils();

  // Fetch pending memberships from members table
  const { data, isLoading } = trpc.membership.getPending.useQuery({ page: 1, pageSize: 1000 });

  // The members data is already filtered for pending by the backend
  const pendingMembers = data?.items || [];

  const approveMutation = trpc.membership.approve.useMutation({
    onSuccess: () => {
      toast.success("Membership request approved!");
      utils.membership.getPending.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const rejectMutation = trpc.membership.reject.useMutation({
    onSuccess: () => {
      toast.success("Membership request rejected.");
      utils.membership.getPending.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading membership requests...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Membership Requests</h1>
          <p className="text-gray-500 mt-1">Review and approve new user applications.</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
          {pendingMembers.length} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>These users have applied for formal membership and require approval.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingMembers.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500 mt-4">
              <Check className="w-12 h-12 mx-auto text-green-200 mb-3" />
              <p className="text-lg font-medium text-gray-900">All caught up!</p>
              <p>There are no pending membership requests at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMembers.map((member) => (
                <div key={member.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-lg text-gray-900">{member.name || "Anonymous Applicant"}</h3>
                      <span className="text-sm text-gray-500 font-mono">({member.membershipNumber})</span>
                      <Badge variant="outline" className="capitalize">{member.membershipType || "Regular"}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-6 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-medium">Email:</span>
                        <span className="truncate max-w-[200px]" title={member.email || undefined}>{member.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-medium">Phone:</span>
                        <span>{member.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{member.createdAt ? format(new Date(member.createdAt), "MMM d, yyyy") : "Recently"}</span>
                      </div>
                    </div>
                    {member.referralCode && (
                      <div className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                        <span className="text-gray-400 font-normal">Referred by:</span>
                        <Badge variant="secondary" className="h-5 py-0 px-2 text-[10px]">{member.referralCode}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <Button
                      className="flex-1 md:flex-none flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        if (window.confirm(`Approve membership request?`)) {
                          approveMutation.mutate({ membershipId: member.id });
                        }
                      }}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 md:flex-none flex items-center gap-2"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to REJECT this membership?`)) {
                          rejectMutation.mutate({ membershipId: member.id });
                        }
                      }}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
