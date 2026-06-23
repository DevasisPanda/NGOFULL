import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Filter, Trash2, Edit, Eye, FileText, ChevronsUpDown, ChevronLeft, ChevronRight, Award, QrCode } from "lucide-react";
import { CaptureActions } from "@/components/CaptureActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ActiveCertificatesPage() {
  const { data: certificates, isLoading } = trpc.document.getCertificates.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [selectedPreviewCert, setSelectedPreviewCert] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading certificates...</div>;
  }

  const activeCertsRaw = certificates?.filter(c => c.certificateType !== "visitor") || [];

  const activeCerts = activeCertsRaw.filter((c) => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c as any).recipientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = activeCerts.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedCerts = activeCerts.slice(startIndex, startIndex + entriesPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const TableHeader = ({ title, width = "auto" }: { title: string, width?: string }) => (
    <th className={`px-2 py-3 border-r border-gray-200 align-middle ${width !== "auto" ? width : ""}`}>
      <div className="flex items-center justify-between text-gray-500 font-bold">
        <span>{title}</span>
        <ChevronsUpDown className="w-3 h-3 opacity-50" />
      </div>
    </th>
  );

  return (
    <div className="p-6 max-w-[100vw] overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Certificates</h1>
          <p className="text-gray-500 mt-1">Review all formally issued activity and membership certificates.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant="outline" className="flex gap-2 items-center text-gray-700 bg-white">
          <Filter className="w-4 h-4" /> Filter
        </Button>
        <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
          Delete Selected
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm bg-white">
        <CardContent className="p-0">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select 
                className="border border-gray-300 rounded px-2 py-1 bg-white outline-none focus:border-blue-500"
                value={entriesPerPage}
                onChange={handleEntriesChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Search:</span>
              <Input 
                className="w-64 h-9 bg-white border-gray-300" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left border-collapse whitespace-nowrap">
              <thead className="text-gray-700 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-3 border-r border-gray-200 w-12 align-middle">
                    <div className="flex flex-col items-center justify-center text-gray-500 font-bold gap-1">
                      <ChevronsUpDown className="w-3 h-3 opacity-50" />
                      <span>Sr.No.</span>
                    </div>
                  </th>
                  <th className="px-2 py-3 border-r border-gray-200 w-16 align-middle">
                    <div className="flex flex-col items-center justify-center text-gray-500 font-bold gap-1">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <div className="flex items-center gap-1">
                        <span>Select All</span>
                        <ChevronsUpDown className="w-3 h-3 opacity-50" />
                      </div>
                    </div>
                  </th>
                  <TableHeader title="Reg.No / Name / Email / Mobile" width="min-w-[280px]" />
                  <TableHeader title="Reg. Date" />
                  <TableHeader title="Detail" />
                  <TableHeader title="Receipt" />
                  <TableHeader title="Action" />
                  <TableHeader title="Ref Member" />
                  <TableHeader title="Ref Donation" />
                  <TableHeader title="Action" />
                </tr>
              </thead>
              <tbody>
                {paginatedCerts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500">No active certificates found.</td>
                  </tr>
                ) : (
                  paginatedCerts.map((cert: any, index) => (
                    <tr key={cert.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-2 py-2 border-r border-gray-200 text-center text-gray-600 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200 text-gray-800 leading-snug whitespace-normal">
                        <span className="font-semibold">{cert.certificateNumber}</span> / {cert.recipientName || "N/A"} / <br className="hidden sm:block" />
                        <span className="text-gray-500 capitalize">{cert.certificateType}</span> / {cert.recipientEmail || "N/A"}
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200 text-gray-600">
                        {cert.issueDate ? format(new Date(cert.issueDate), "dd-MM-yyyy") : "N/A"}
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 px-2 text-xs bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 flex gap-1 mx-auto"
                          onClick={() => {
                            setSelectedPreviewCert(cert);
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 flex gap-1 mx-auto">
                          <FileText className="w-3 h-3" /> Receipt
                        </Button>
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <div className="flex justify-center gap-1">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium">Active</Badge>
                        </div>
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold">0</Badge>
                      </td>
                      <td className="px-2 py-2 border-r border-gray-200 text-center">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold">₹ 0.00</Badge>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex justify-center gap-1">
                          <Button size="icon" variant="outline" className="h-7 w-7 text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-7 w-7 text-red-600 bg-red-50 border-red-200 hover:bg-red-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 text-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600">
            <div>
              Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  return (
                    <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(pageNum)}>
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== PREVIEW CERTIFICATE DIALOG ==================== */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <Award className="w-5 h-5 text-purple-600" />
              Certificate Document Preview
            </DialogTitle>
            <DialogDescription>
              Preview of officially generated certificate.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex justify-center">
            {selectedPreviewCert && (
              selectedPreviewCert.certificateType === 'achievement' ? (
                /* Achievement Template (Landscape) */
                <div ref={previewRef} className="relative w-full max-w-xl aspect-[1.414/1] rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
                  <img 
                    src="https://res.cloudinary.com/dxmovdiru/image/upload/v1781611663/ngo-management/templates/achievement_certificate_template.jpg" 
                    alt="Achievement Certificate Template" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Name Overlay */}
                  <div className="absolute top-[48%] left-0 right-0 text-center px-8">
                    <span className="font-serif text-[15px] sm:text-[20px] text-slate-800 font-bold tracking-wide italic inline-block">
                      {selectedPreviewCert.recipientName || "Registered Recipient"}
                    </span>
                  </div>

                  {/* Description Overlay */}
                  <div className="absolute top-[61%] left-[10%] right-[10%] text-center text-slate-600 text-[8px] sm:text-[11px] leading-relaxed">
                    {selectedPreviewCert.description || `This certificate is officially presented to acknowledge their dedication and valuable service as a registered achievement recipient of the Valmiki Samaj Charitable Trust.`}
                  </div>

                  {/* Issue Date Overlay */}
                  <div className="absolute bottom-[13%] left-[17%] text-[7px] sm:text-[9.5px] text-slate-600 font-medium font-mono">
                    {selectedPreviewCert.issueDate ? format(new Date(selectedPreviewCert.issueDate), "dd/MM/yyyy") : ""}
                  </div>

                  {/* Certificate Number Overlay */}
                  <div className="absolute bottom-[13%] right-[17%] text-[7px] sm:text-[9.5px] text-slate-600 font-medium font-mono">
                    {selectedPreviewCert.certificateNumber}
                  </div>
                </div>
              ) : (
                /* Membership/Volunteer/Other Templates (Portrait) */
                <div ref={previewRef} className="relative w-full max-w-md aspect-[904/1354] rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
                  <img 
                    src="https://res.cloudinary.com/dxmovdiru/image/upload/v1781611666/ngo-management/templates/membership_certificate_template.jpg" 
                    alt="Membership Certificate Template" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Name Overlay */}
                  <div className="absolute left-0 right-0 text-center px-8" style={{ top: '39.14%' }}>
                    <span className="font-serif text-[15px] sm:text-[20px] text-slate-800 font-bold tracking-wide italic inline-block">
                      {selectedPreviewCert.recipientName || "Registered Recipient"}
                    </span>
                  </div>

                  {/* Membership Number */}
                  <div className="absolute text-center" style={{ top: '54.65%', left: '17.7%', transform: 'translateX(-50%)', width: '30%' }}>
                    <span className="font-sans text-[9px] sm:text-[12px] text-slate-800 font-bold">
                      {selectedPreviewCert.certificateNumber}
                    </span>
                  </div>

                  {/* Issue Date */}
                  <div className="absolute text-center" style={{ top: '54.65%', left: '51.44%', transform: 'translateX(-50%)', width: '30%' }}>
                    <span className="font-sans text-[9px] sm:text-[12px] text-slate-800 font-bold">
                      {selectedPreviewCert.issueDate ? format(new Date(selectedPreviewCert.issueDate), "dd/MM/yyyy") : ""}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="absolute text-center" style={{ top: '54.65%', left: '82.41%', transform: 'translateX(-50%)', width: '30%' }}>
                    <span className="font-sans text-[9px] sm:text-[12px] text-slate-800 font-bold">
                      {selectedPreviewCert.expiryDate ? format(new Date(selectedPreviewCert.expiryDate), "dd/MM/yyyy") : "Lifetime"}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>

          <DialogFooter className="pt-2 border-t flex gap-2">
            <CaptureActions cardRef={previewRef} filename={`Certificate_${selectedPreviewCert?.certificateNumber || "document"}`} />
            <Button className="bg-teal-700 hover:bg-teal-800 text-white" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
