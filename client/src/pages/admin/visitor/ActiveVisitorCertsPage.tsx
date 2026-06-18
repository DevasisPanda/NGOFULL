import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isBefore } from "date-fns";
import { Filter, Trash2, Edit, Eye, FileText, ChevronsUpDown, ChevronLeft, ChevronRight, UserCheck, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ActiveVisitorCertsPage() {
  const { data: certificates, isLoading } = trpc.document.getCertificates.useQuery({
    certificateType: "visitor"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [selectedPreviewCert, setSelectedPreviewCert] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading visitor passes...</div>;
  }

  const visitorCertsRaw = certificates || [];
  const today = new Date();

  const visitorCerts = visitorCertsRaw.filter((c) => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries = visitorCerts.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedCerts = visitorCerts.slice(startIndex, startIndex + entriesPerPage);

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
          <h1 className="text-3xl font-bold text-gray-900">Active Visitor Passes</h1>
          <p className="text-gray-500 mt-1">Review all temporary visitor passes issued.</p>
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
                    <td colSpan={10} className="text-center py-8 text-gray-500">No visitor passes found.</td>
                  </tr>
                ) : (
                  paginatedCerts.map((cert: any, index) => {
                    const isExpired = cert.expiryDate && isBefore(new Date(cert.expiryDate), today);

                    return (
                      <tr key={cert.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-2 py-2 border-r border-gray-200 text-center text-gray-600 font-medium">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-2 py-2 border-r border-gray-200 text-center">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200 text-gray-800 leading-snug whitespace-normal">
                          <span className="font-semibold">{cert.certificateNumber}</span> / {cert.title || "N/A"} / <br className="hidden sm:block" />
                          <span className="text-gray-500 capitalize">{cert.certificateType}</span> / N/A
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
                            {isExpired ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : (
                              <Badge className="bg-green-500">Active</Badge>
                            )}
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
                    );
                  })
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

      {/* ==================== VISITOR PASS PREVIEW DIALOG ==================== */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-800">
              <UserCheck className="w-5 h-5 text-orange-600" />
              Visitor Pass Preview
            </DialogTitle>
            <DialogDescription>
              Preview of officially issued temporary visitor pass.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex justify-center">
            {selectedPreviewCert && (
              <div className="relative w-[600px] aspect-[1.5/1] rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white flex flex-col items-center" style={{ fontFamily: "'Arial', sans-serif" }}>
                <img 
                  src="https://res.cloudinary.com/dxmovdiru/image/upload/v1781611667/ngo-management/templates/generate_id_template.jpg" 
                  alt="Visitor Pass Template" 
                  className="w-full h-full object-contain" 
                  crossOrigin="anonymous"
                />
                
                {/* Photo Overlay Placeholder */}
                <div className="absolute top-[41.5%] left-[23%] -translate-x-1/2 w-[16%] aspect-[1/1] rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 flex items-center justify-center">
                  <UserCheck className="w-12 h-12 text-teal-800 opacity-60" />
                </div>

                {/* Name Overlay */}
                <div className="absolute top-[32%] left-[4.5%] w-[40%] text-center">
                  <h4 className="font-extrabold text-[12px] sm:text-[16px] text-red-600 uppercase tracking-wide line-clamp-1">{selectedPreviewCert.title}</h4>
                </div>

                {/* Left Side Details */}
                {/* ID No (Pass No) */}
                <div className="absolute top-[62.5%] left-[28%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    {selectedPreviewCert.certificateNumber}
                  </span>
                </div>

                {/* Mob No */}
                <div className="absolute top-[67%] left-[17%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    N/A
                  </span>
                </div>

                {/* Email (Purpose) */}
                <div className="absolute top-[71%] left-[17%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800 line-clamp-1 w-[150px]">
                    {selectedPreviewCert.description || 'Official Visit'}
                  </span>
                </div>

                {/* City */}
                <div className="absolute top-[75%] left-[13%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    N/A
                  </span>
                </div>

                {/* Right Side Details */}
                {/* Joining Date (Issue Date) */}
                <div className="absolute top-[79.5%] left-[78%]">
                  <span className="font-bold text-[11px] sm:text-[15px] text-[#0f2454]">
                    {selectedPreviewCert.issueDate ? format(new Date(selectedPreviewCert.issueDate), "dd-MM-yyyy") : ""}
                  </span>
                </div>

                {/* Validity Date (Valid Till) */}
                <div className="absolute top-[84%] left-[78%]">
                  <span className="font-bold text-[11px] sm:text-[15px] text-[#0f2454]">
                    {selectedPreviewCert.expiryDate ? format(new Date(selectedPreviewCert.expiryDate), "dd-MM-yyyy") : "Same Day"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white" onClick={() => setIsPreviewModalOpen(false)}>
              Close Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
