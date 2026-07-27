import React, { useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

const Beneficiaries: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<'education' | 'health' | 'livelihood' | 'emergency' | 'other'>('education');
  const [notes, setNotes] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [executionPlan, setExecutionPlan] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Cropper Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"square" | "portrait">("square");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const editorImgRef = useRef<HTMLImageElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: myMembership } = trpc.membership.getMyMembership.useQuery(undefined, { enabled: isAuthenticated });

  const createMutation = trpc.beneficiary.create.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCategory('education');
      setNotes('');
      setRequestedAmount('');
      setTargetEmail('');
      setExecutionPlan('');
      setBase64Image(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit application.");
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditorImageSrc(base64);
      setIsEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const fitImageToViewport = (img: HTMLImageElement, ratio: "square" | "portrait") => {
    const w_v = ratio === "portrait" ? 240 : 280;
    const h_v = ratio === "portrait" ? 320 : 280;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const viewRatio = w_v / h_v;

    let baseWidth = w_v;
    let baseHeight = h_v;

    if (imgRatio > viewRatio) {
      baseHeight = h_v;
      baseWidth = h_v * imgRatio;
    } else {
      baseWidth = w_v;
      baseHeight = w_v / imgRatio;
    }

    setRenderedSize({ width: baseWidth, height: baseHeight });
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleImageLoad = (img: HTMLImageElement) => {
    fitImageToViewport(img, aspectRatio);
  };

  const handleRatioChange = (newRatio: "square" | "portrait") => {
    setAspectRatio(newRatio);
    if (editorImgRef.current) {
      fitImageToViewport(editorImgRef.current, newRatio);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPan({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { 
        x: e.touches[0].clientX - pan.x, 
        y: e.touches[0].clientY - pan.y 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const newX = e.touches[0].clientX - dragStartRef.current.x;
    const newY = e.touches[0].clientY - dragStartRef.current.y;
    setPan({ x: newX, y: newY });
  };

  const handleCropConfirm = () => {
    const imgElement = editorImgRef.current;
    if (!imgElement) return;

    const W_view = aspectRatio === 'portrait' ? 240 : 280;
    const H_view = aspectRatio === 'portrait' ? 320 : 280;
    const W_canvas = 600;
    const H_canvas = aspectRatio === 'portrait' ? 800 : 600;

    const canvas = document.createElement("canvas");
    canvas.width = W_canvas;
    canvas.height = H_canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x / zoom, pan.y / zoom);

    const scaleRatio = canvas.width / W_view;
    const wDraw = renderedSize.width * scaleRatio;
    const hDraw = renderedSize.height * scaleRatio;

    ctx.drawImage(imgElement, -wDraw / 2, -hDraw / 2, wDraw, hDraw);

    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
    setBase64Image(croppedBase64);
    setImagePreview(croppedBase64);
    setIsEditorOpen(false);
    toast.success("Photo adjusted successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit an application.");
      return;
    }

    const goalVal = parseFloat(requestedAmount);
    if (isNaN(goalVal) || goalVal < 0) {
      toast.error("Goal amount must be a positive number.");
      return;
    }

    createMutation.mutate({
      name: fullName,
      email: email,
      phone: phone,
      address: address,
      category: category,
      notes: notes,
      profileImage: base64Image || undefined,
      requestedAmount: goalVal,
      targetEmail: targetEmail || undefined,
      executionPlan: executionPlan || undefined,
    });
  };

  // Redirect unauthenticated users to login
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (myMembership?.status !== "active") {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-20 text-center font-['Plus_Jakarta_Sans']">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-10 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-amber-950">Active Membership Required</h2>
            <p className="text-amber-800 text-base mt-2 max-w-lg mx-auto">
              {myMembership?.status === "pending"
                ? "Your membership application is currently under 24-hour review! Beneficiary applications will be unlocked once approved by our team."
                : "You must apply for an active membership before submitting beneficiary applications."}
            </p>
          </div>
          <div className="pt-2">
            <a
              href="http://localhost:5173/member/membership"
              className="inline-block bg-[#061941] text-[#fed813] hover:bg-[#122e6b] px-8 py-3.5 rounded-xl font-extrabold shadow-lg transition-all"
            >
              Go to Membership Application & Pay
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#f9fafb] pb-24 font-['Plus_Jakarta_Sans']">
      {/* Banner */}
      <section className="bg-[#061941] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-[#fed813] rounded-full blur-[160px] opacity-15 pointer-events-none"></div>

        <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-secondary text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#fed813]">
            Apply for Beneficiary Assistance
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Are you or someone you know in need of support? Fill out the form below to apply for our NGO community assistance program.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="max-w-[720px] mx-auto px-6 mt-[-40px] relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header info */}
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-2xl font-bold text-[#061941] mb-1">Application Form</h2>
              <p className="text-gray-500 text-sm">Please provide accurate contact details so our team can reach out to you.</p>
            </div>

            {/* Profile Image upload */}
            <div className="flex flex-col items-center sm:flex-row gap-5 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-white flex items-center justify-center text-gray-400">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="block text-sm font-semibold text-gray-700 mb-1">Profile Image / Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden" 
                  id="profile-upload" 
                />
                <label 
                  htmlFor="profile-upload" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-bold text-xs hover:bg-gray-50 transition cursor-pointer shadow-sm"
                >
                  Choose File
                </label>
                <span className="block text-[11px] text-gray-400 mt-1.5">Max file size: 2MB (JPG, PNG, WebP)</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="fullName">Full Name *</label>
              <input 
                id="fullName" 
                type="text" 
                required 
                placeholder="Enter applicant's full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Contact details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">Phone Number *</label>
                <input 
                  id="phone" 
                  type="tel" 
                  required 
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">Email Address (Optional)</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="example@mail.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="category">Assistance Category *</label>
              <select 
                id="category"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white font-medium"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="education">Education Support</option>
                <option value="health">Healthcare assistance</option>
                <option value="livelihood">Livelihood & Employment</option>
                <option value="emergency">Emergency Relief</option>
                <option value="other">Other Requirements</option>
              </select>
            </div>

            {/* Requested Goal Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="requestedAmount">Requested Goal Amount (INR) *</label>
              <input 
                id="requestedAmount" 
                type="number" 
                required 
                min="0"
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
              />
            </div>

            {/* Target Recipient Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="targetEmail">Target Recipient Email (For whom collecting - Optional)</label>
              <input 
                id="targetEmail" 
                type="email" 
                placeholder="recipient@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="address">Residential Address *</label>
              <textarea 
                id="address" 
                rows={3} 
                required
                placeholder="Enter complete residential address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="notes">Why do you need assistance? (Notes / details)</label>
              <textarea 
                id="notes" 
                rows={4} 
                placeholder="Please describe your requirements or situation in detail so we can assess your application better."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Execution Plan / Events */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="executionPlan">Execution Plan / Distribution Event details (Optional)</label>
              <textarea 
                id="executionPlan" 
                rows={3} 
                placeholder="Briefly describe how this donation will be executed (e.g. funds directly paid to the school, distributed during a charity drive...)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061941]/50 focus:border-[#061941] text-sm bg-white resize-none"
                value={executionPlan}
                onChange={(e) => setExecutionPlan(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-transparent rounded-lg shadow-md text-sm font-bold text-[#061941] bg-[#fed813] hover:bg-[#ebd41c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>

      {/* Cropper Modal for Beneficiary Applicants */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[95vh]">
            <div className="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-none">Photo Adjustment</h3>
                <span className="text-[11px] text-gray-400 font-medium">Position your photo for a clean framing</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditorOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex gap-2 items-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Ratio:</span>
              <button
                type="button"
                onClick={() => handleRatioChange("square")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === "square" ? "bg-[#061941] text-white" : "bg-white border border-gray-200 text-gray-600"
                }`}
              >
                1:1 (Square)
              </button>
              <button
                type="button"
                onClick={() => handleRatioChange("portrait")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === "portrait" ? "bg-[#061941] text-white" : "bg-white border border-gray-200 text-gray-600"
                }`}
              >
                3:4 (Portrait)
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-slate-950 overflow-hidden min-h-[340px] relative">
              <div 
                className="relative overflow-hidden bg-slate-900 shadow-2xl select-none cursor-move shrink-0"
                style={{ 
                  width: `${aspectRatio === 'portrait' ? 240 : 280}px`, 
                  height: `${aspectRatio === 'portrait' ? 320 : 280}px`,
                  borderRadius: aspectRatio === 'square' ? '50%' : '12px',
                  border: '2px solid #fed813',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
              >
                <img
                  ref={editorImgRef}
                  src={editorImageSrc || ''}
                  alt="To crop"
                  className="max-w-none max-h-none pointer-events-none absolute"
                  style={{
                    width: `${renderedSize.width}px`,
                    height: `${renderedSize.height}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center'
                  }}
                  onLoad={(e) => handleImageLoad(e.currentTarget)}
                />
              </div>
              
              <p className="text-[11px] text-slate-400 font-semibold mt-4 tracking-wide uppercase">
                Drag to Position • Slider to Zoom
              </p>
              
              <div className="w-full max-w-xs mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 shrink-0">Zoom -</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#fed813]"
                />
                <span className="text-xs font-bold text-slate-400 shrink-0">Zoom +</span>
              </div>
            </div>

            <div className="p-4 bg-white flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="px-5 py-2 bg-[#061941] text-[#fed813] font-bold rounded-lg text-sm hover:bg-[#0c2866] transition-colors shadow-sm"
              >
                Save & Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
