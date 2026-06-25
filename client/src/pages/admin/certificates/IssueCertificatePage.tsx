import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaptureActions } from "@/components/CaptureActions";
import { mergeTemplates, type TemplateConfig } from "@/lib/templates";
import { VerifiableDocument } from "@/components/VerifiableDocument";
import { format } from "date-fns";
import { Award, FileText, Calendar, Eye } from "lucide-react";

type PreviewData = {
  template: TemplateConfig;
  fieldValues: Record<string, string>;
  type: string;
};

export default function IssueCertificatePage() {
  const [formData, setFormData] = useState({
    recipientId: "",
    certificateType: "achievement",
    title: "",
    description: "",
    expiryDate: "",
    position: "",
    appointmentDate: format(new Date(), "yyyy-MM-dd"),
    toDate: "",
  });

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: usersData, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery({ page: 1, pageSize: 1000 });
  const { data: dbTemplates } = trpc.document.getTemplateConfigs.useQuery();

  const mergedTemplates = mergeTemplates(dbTemplates);

  const generateMutation = trpc.document.generateCertificate.useMutation({
    onSuccess: (data: any) => {
      toast.success("Certificate issued successfully!");
      const tpl = formData.certificateType === "achievement" 
        ? mergedTemplates.find(t => t.id === "achievement")! 
        : mergedTemplates.find(t => t.id === "membership")!;
      const user = usersData?.items?.find(u => u.id.toString() === formData.recipientId);
      setPreview({
        template: tpl,
        fieldValues: {
          fullName: user?.name || "",
          description: formData.description || "",
          issueDate: format(new Date(), "dd/MM/yyyy"),
          certificateNumber: data?.certificateNumber || "CERT-00000",
        },
        type: formData.certificateType,
      });
      utils.document.getCertificates.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to issue certificate");
    }
  });

  const appointmentMutation = trpc.document.generateAppointmentLetter.useMutation({
    onSuccess: (data) => {
      toast.success(`Appointment letter generated! Ref: ${data.letterNumber}`);
      const user = usersData?.items?.find(u => u.id.toString() === formData.recipientId);
      const tpl = mergedTemplates.find(t => t.id === "appointment")!;
      setPreview({
        template: tpl,
        fieldValues: {
          letterNumber: data.letterNumber || `APPT_${Date.now()}`,
          name1: user?.name || "",
          name2: user?.name || "",
          post: formData.position,
          mobile: user?.phone || "",
          fromDate: format(new Date(formData.appointmentDate), "dd/MM/yyyy"),
          toDate: formData.toDate || "Ongoing",
        },
        type: "appointment",
      });
      utils.document.getCertificates.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate appointment letter");
    }
  });

  const resetForm = () => {
    setFormData({
      recipientId: "",
      certificateType: "achievement",
      title: "",
      description: "",
      expiryDate: "",
      position: "",
      appointmentDate: format(new Date(), "yyyy-MM-dd"),
      toDate: "",
    });
  };

  const isAppointment = formData.certificateType === "appointment";
  const isPending = generateMutation.isPending || appointmentMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientId) {
      toast.error("Please select a recipient");
      return;
    }
    const recipientId = parseInt(formData.recipientId);
    if (isAppointment) {
      if (!formData.position) {
        toast.error("Please fill in the Position");
        return;
      }
      appointmentMutation.mutate({
        recipientId,
        position: formData.position,
        appointmentDate: new Date(formData.appointmentDate),
        letterContent: formData.position,
      });
    } else {
      if (!formData.title) {
        toast.error("Please fill in the certificate title");
        return;
      }
      generateMutation.mutate({
        recipientId,
        certificateType: formData.certificateType as "membership" | "achievement" | "visitor" | "volunteer",
        title: formData.title,
        description: formData.description,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      });
    }
  };

  const selectedUser = usersData?.items?.find(u => u.id.toString() === formData.recipientId);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Issue Document</h1>
          <p className="text-gray-500 mt-1">Generate a certificate or appointment letter for a system user.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
          <CardDescription>
            {isAppointment
              ? "Generate an official appointment letter."
              : "Fill out the form below to generate a verifiable certificate."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="recipientId">Recipient User *</Label>
                <Select value={formData.recipientId} onValueChange={(val) => setFormData({ ...formData, recipientId: val })} disabled={usersLoading}>
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
              <div className="space-y-2">
                <Label htmlFor="certificateType">Document Type *</Label>
                <Select value={formData.certificateType} onValueChange={(val) => setFormData({ ...formData, certificateType: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achievement">Achievement Certificate</SelectItem>
                    <SelectItem value="membership">Membership Certificate</SelectItem>
                    <SelectItem value="appointment">Appointment Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isAppointment ? (
              <>
                {selectedUser && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-1">
                    <p><strong>Recipient:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    {selectedUser.phone && <p><strong>Phone:</strong> {selectedUser.phone}</p>}
                  </div>
                )}
<div className="space-y-2">
                  <Label htmlFor="position">Position / Post *</Label>
                  <Textarea id="position" placeholder="e.g. Volunteer Coordinator

Details about the role..." value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} rows={3} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Appointment Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input id="appointmentDate" type="date" className="pl-9" value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toDate">To Date</Label>
                    <Input id="toDate" type="date" value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title *</Label>
                  <Input id="title" placeholder="e.g. Outstanding Volunteer of the Year" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" placeholder="Details about why this certificate was awarded..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
                </div>
                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="expiryDate">Expiration Date (Optional)</Label>
                  <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={isPending}>
              <FileText className="w-5 h-5 mr-2" />
              {isPending ? "Generating..." : isAppointment ? "Generate Appointment Letter" : "Generate Certificate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Dialog — uses Builder coordinates from templates.ts */}
      <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-w-3xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <Eye className="w-5 h-5" />
              {preview?.type === "appointment" ? "Appointment Letter Preview" : "Certificate Preview"}
            </DialogTitle>
          </DialogHeader>

          {preview && (
            <div className="py-4">
              <VerifiableDocument
                templateId={preview.template.id}
                fieldValues={preview.fieldValues}
                dbTemplates={dbTemplates}
                cardRef={previewRef}
                className="max-w-lg mx-auto rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t">
            <CaptureActions cardRef={previewRef} filename={preview?.type === "appointment" ? "Appointment_Letter" : "Certificate"} />
            <Button variant="outline" onClick={() => { setPreview(null); resetForm(); }}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
