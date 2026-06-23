import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaptureActions } from "@/components/CaptureActions";
import { ID_CARD_TEMPLATE } from "@/lib/templates";
import { format } from "date-fns";
import { Eye, UserCheck, Calendar } from "lucide-react";

export default function GenerateVisitorCertPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    mobile: "",
    email: "",
    city: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    expiryDate: "",
  });

  const [preview, setPreview] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const generateMutation = trpc.document.generateCertificate.useMutation({
    onSuccess: () => {
      toast.success("Visitor certificate generated successfully!");
      setPreview({
        template: ID_CARD_TEMPLATE,
        fieldValues: {
          fullName: formData.fullName || "Visitor",
          designation: formData.designation || "Visitor",
          cardNumber: `VSCT-VIS-${Date.now().toString(36).toUpperCase()}`,
          mobile: formData.mobile || "",
          email: formData.email || "",
          city: formData.city || "",
          issueDate: format(new Date(formData.issueDate), "dd/MM/yyyy"),
          expiryDate: formData.expiryDate ? format(new Date(formData.expiryDate), "dd/MM/yyyy") : "Same Day",
        },
        type: "visitor",
      });
      utils.document.getCertificates.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate visitor certificate");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      toast.error("Please enter the visitor name");
      return;
    }
    generateMutation.mutate({
      recipientId: 1,
      certificateType: "visitor",
      title: formData.fullName,
      description: formData.designation || "Official Visitor",
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserCheck className="w-8 h-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold">Visitor Pass</h1>
          <p className="text-gray-500 mt-1">Generate a temporary visitor pass for NGO visitors.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Information</CardTitle>
          <CardDescription>Fill in the details below. Fields map directly to the ID card template.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" placeholder="e.g. John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation / Purpose</Label>
              <Input id="designation" placeholder="e.g. Guest Speaker" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" placeholder="e.g. 9876543210" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="e.g. john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. New Delhi" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input id="issueDate" type="date" className="pl-9" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Valid Until</Label>
                <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg" disabled={generateMutation.isPending}>
              <UserCheck className="w-5 h-5 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate Pass"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-w-3xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-700">
              <Eye className="w-5 h-5" />
              Visitor Pass Preview
            </DialogTitle>
          </DialogHeader>

          {preview && (
            <div className="py-4">
              <div ref={previewRef} className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-md">
                <img src={preview.template.src} alt="ID Card Template" className="w-full h-auto" crossOrigin="anonymous" />
                {preview.template.fields.map((field: any) => {
                  const val = preview.fieldValues[field.id];
                  if (!val) return null;
                  const style: React.CSSProperties = {
                    position: "absolute",
                    left: `${(field.x / preview.template.imgWidth) * 100}%`,
                    top: `${(field.y / preview.template.imgHeight) * 100}%`,
                    fontSize: `${field.size}px`,
                    color: field.color,
                    fontWeight: field.weight,
                    textAlign: field.align,
                    transform: field.align === "center" ? "translateX(-50%)" : field.align === "right" ? "translateX(-100%)" : undefined,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                    pointerEvents: "none",
                  };
                  return <span key={field.id} style={style}>{val}</span>;
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t">
            <CaptureActions cardRef={previewRef} filename="Visitor_Pass" />
            <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
