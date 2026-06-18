import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";

export default function GenerateVisitorCertPage() {
  const [formData, setFormData] = useState({
    recipientId: "1", // Hardcoded to 1 for visitor proxy (usually visitors aren't registered)
    title: "Official Visitor",
    description: "Granted access as an official visitor to the NGO premises.",
    expiryDate: "",
  });

  const utils = trpc.useUtils();
  const generateMutation = trpc.document.generateCertificate.useMutation({
    onSuccess: () => {
      toast.success("Visitor certificate generated successfully!");
      utils.document.getCertificates.invalidate();
      setFormData({
        recipientId: "1",
        title: "Official Visitor",
        description: "Granted access as an official visitor to the NGO premises.",
        expiryDate: "",
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to issue visitor certificate");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Please fill in the title");
      return;
    }

    // In a real app, you might create a temporary user or just log the visitor name.
    // For now, we use recipientId = 1 since the schema requires an int.
    generateMutation.mutate({
      recipientId: parseInt(formData.recipientId),
      certificateType: "visitor",
      title: formData.title,
      description: formData.description,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserCheck className="w-8 h-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold">Visitor Passes</h1>
          <p className="text-gray-500 mt-1">Generate temporary visitor certificates.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
          <CardDescription>Issue a streamlined pass for NGO visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Visitor Name / Title *</Label>
              <Input
                id="title"
                placeholder="e.g. John Doe - Guest Speaker"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Purpose of Visit</Label>
              <Input
                id="description"
                placeholder="e.g. Attending the annual meeting"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Expiry */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Valid Until (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg"
              disabled={generateMutation.isPending}
            >
              <UserCheck className="w-5 h-5 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate Pass"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
