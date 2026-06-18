import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Award, FileText } from "lucide-react";

export default function IssueCertificatePage() {
  const [formData, setFormData] = useState({
    recipientId: "",
    certificateType: "achievement",
    title: "",
    description: "",
    expiryDate: "",
  });

  const utils = trpc.useUtils();
  const { data: usersData, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery({ page: 1, pageSize: 1000 });
  const generateMutation = trpc.document.generateCertificate.useMutation({
    onSuccess: () => {
      toast.success("Certificate issued successfully!");
      utils.document.getCertificates.invalidate();
      setFormData({
        recipientId: "",
        certificateType: "achievement",
        title: "",
        description: "",
        expiryDate: "",
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to issue certificate");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientId || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    generateMutation.mutate({
      recipientId: parseInt(formData.recipientId),
      certificateType: formData.certificateType as "membership" | "achievement" | "visitor" | "volunteer",
      title: formData.title,
      description: formData.description,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Issue Certificate</h1>
          <p className="text-gray-500 mt-1">Generate a new official certificate for a system user.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>Fill out the form below to generate a verifiable PDF certificate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipient */}
              <div className="space-y-2">
                <Label htmlFor="recipientId">Recipient User *</Label>
                <Select 
                  value={formData.recipientId} 
                  onValueChange={(val) => setFormData({ ...formData, recipientId: val })}
                  disabled={usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select a recipient"} />
                  </SelectTrigger>
                  <SelectContent>
                    {usersData?.items?.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type *</Label>
                <Select 
                  value={formData.certificateType} 
                  onValueChange={(val) => setFormData({ ...formData, certificateType: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    {/* Visitor is omitted here as it has a dedicated page */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Certificate Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Outstanding Volunteer of the Year"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Details about why this certificate was awarded..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Expiry */}
            <div className="space-y-2 w-full md:w-1/2">
              <Label htmlFor="expiryDate">Expiration Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
              <p className="text-xs text-gray-500">Leave blank if the certificate does not expire.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              disabled={generateMutation.isPending}
            >
              <FileText className="w-5 h-5 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate Certificate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
