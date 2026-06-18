import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Mail, Megaphone, Clock, CheckCircle2 } from "lucide-react";

export default function PreviousNoticesPage() {
  const { data: messages, isLoading } = trpc.message.getPreviousNotices.useQuery();

  if (isLoading) {
    return <div className="p-8">Loading previous notices...</div>;
  }

  const notices = messages || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Communication Log</h1>
          <p className="text-gray-500 mt-1">Review all historical messages and broadcasts sent by the system.</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {notices.length} Total Records
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>Comprehensive list of all past direct messages and bulk notices.</CardDescription>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500 mt-4">
              <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No messages sent yet</p>
              <p>Your communication history will appear here once you send a message.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.messageType === "bulk" ? (
                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-md">
                          <Megaphone className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                          <Mail className="w-4 h-4" />
                        </div>
                      )}
                      <h3 className="font-semibold text-lg">{notice.subject}</h3>
                      <Badge variant={notice.messageType === "bulk" ? "default" : "secondary"} className="capitalize">
                        {notice.messageType}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3 text-sm line-clamp-2">{notice.content}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Sent {notice.sentAt ? format(new Date(notice.sentAt), "MMM d, yyyy 'at' h:mm a") : "Unknown date"}
                      </div>
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: <span className="capitalize">{notice.status}</span>
                      </div>
                    </div>
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
