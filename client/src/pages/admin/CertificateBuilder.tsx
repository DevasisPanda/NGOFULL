import React, { useState, useEffect, useRef } from 'react';

// Types and Defaults
type FieldConfig = {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  weight: 'normal' | 'bold';
  align: 'left' | 'center' | 'right';
};

type TemplateConfig = {
  id: string;
  name: string;
  src: string;
  fields: FieldConfig[];
};

const INITIAL_TEMPLATES: TemplateConfig[] = [
  {
    id: 'membership',
    name: 'Membership Certificate',
    src: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611666/ngo-management/templates/membership_certificate_template.jpg',
    fields: [
      { id: 'fullName', label: 'Member Name', text: 'Devasis Panda', x: 450, y: 530, size: 36, color: '#1e293b', weight: 'bold', align: 'center' },
      { id: 'membershipNumber', label: 'Membership No.', text: 'VSCT-2026-001', x: 160, y: 740, size: 20, color: '#1e293b', weight: 'bold', align: 'center' },
      { id: 'joinDate', label: 'Join Date', text: '22/06/2026', x: 465, y: 740, size: 20, color: '#1e293b', weight: 'bold', align: 'center' },
      { id: 'expiryDate', label: 'Expiry Date', text: 'Lifetime', x: 745, y: 740, size: 20, color: '#1e293b', weight: 'bold', align: 'center' }
    ]
  },
  {
    id: 'achievement',
    name: 'Achievement Certificate',
    src: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611663/ngo-management/templates/achievement_certificate_template.jpg',
    fields: [
      { id: 'fullName', label: 'Recipient Name', text: 'Devasis Panda', x: 330, y: 600, size: 36, color: '#1f2937', weight: 'bold', align: 'center' },
      { id: 'description', label: 'Description', text: 'For outstanding volunteer contribution to the community.', x: 630, y: 690, size: 26, color: '#4b5563', weight: 'normal', align: 'center' },
      { id: 'issueDate', label: 'Issue Date', text: '22/06/2026', x: 120, y: 830, size: 20, color: '#4b5563', weight: 'bold', align: 'left' },
      { id: 'certificateNumber', label: 'Cert No.', text: 'CERT-12345', x: 670, y: 830, size: 32, color: '#4b5563', weight: 'bold', align: 'right' }
    ]
  },
  {
    id: 'appointment',
    name: 'Appointment Letter',
    src: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611664/ngo-management/templates/appointment_letter_template.jpg',
    fields: [
      { id: 'letterNumber', label: 'Ref Number', text: 'VSCT/APP/2026/045', x: 310, y: 385, size: 20, color: '#1f2937', weight: 'bold', align: 'left' },
      { id: 'name1', label: 'Name (1st)', text: 'Devasis Panda', x: 130, y: 454, size: 22, color: '#1f2937', weight: 'bold', align: 'left' },
      { id: 'name2', label: 'Name (2nd)', text: 'Devasis Panda', x: 409, y: 780, size: 22, color: '#1f2937', weight: 'bold', align: 'center' },
      { id: 'post', label: 'Post / Position', text: 'VOLUNTEER COORDINATOR', x: 1080, y: 782, size: 24, color: '#0f172a', weight: 'bold', align: 'right' },
      { id: 'mobile', label: 'Mobile Number', text: '+91 98765 43210', x: 150, y: 420, size: 20, color: '#1f2937', weight: 'normal', align: 'left' },
      { id: 'fromDate', label: 'From Date', text: '22-06-2026', x: 240, y: 630, size: 20, color: '#4b5563', weight: 'bold', align: 'left' },
      { id: 'toDate', label: 'To Date', text: '22-06-2027', x: 604, y: 630, size: 20, color: '#4b5563', weight: 'bold', align: 'left' }
    ]
  },
  {
    id: 'donation',
    name: 'Donation Receipt',
    src: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611665/ngo-management/templates/donation_receipt_template.jpg',
    fields: [
      { id: 'receiptNumber', label: 'Receipt No.', text: 'VSCT/RCPT/2026/98765', x: 208, y: 224, size: 18, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'date', label: 'Date', text: '22/06/2026', x: 706, y: 224, size: 18, color: '#1e293b', weight: 'bold', align: 'right' },
      { id: 'donorName', label: 'Donor Name', text: 'Devasis Panda', x: 217, y: 384, size: 22, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'amount', label: 'Amount', text: '₹5,000.00', x: 217, y: 563, size: 24, color: '#115e59', weight: 'bold', align: 'left' },
      { id: 'purpose', label: 'Purpose', text: 'General Donation', x: 217, y: 723, size: 20, color: '#1e293b', weight: 'bold', align: 'left' }
    ]
  },
  {
    id: 'id_card',
    name: 'Generate ID',
    src: 'https://res.cloudinary.com/dxmovdiru/image/upload/v1781611667/ngo-management/templates/generate_id_template.jpg',
    fields: [
      { id: 'fullName', label: 'Name', text: 'Devasis Panda', x: 392, y: 655, size: 32, color: '#ef4444', weight: 'bold', align: 'center' },
      { id: 'designation', label: 'Designation', text: 'Senior Coordinator', x: 416, y: 380, size: 22, color: '#0f766e', weight: 'bold', align: 'center' },
      { id: 'cardNumber', label: 'Card No.', text: 'VSCT-ID-492019', x: 275, y: 685, size: 24, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'mobile', label: 'Mobile', text: '+91 98765 43210', x: 157, y: 730, size: 24, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'email', label: 'Email', text: 'devasis.panda@gmail.com', x: 150, y: 780, size: 20, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'city', label: 'City', text: 'New Delhi', x: 110, y: 830, size: 24, color: '#1e293b', weight: 'bold', align: 'left' },
      { id: 'issueDate', label: 'Issue Date', text: '22-06-2026', x: 1247, y: 848, size: 24, color: '#0f2454', weight: 'bold', align: 'left' },
      { id: 'expiryDate', label: 'Valid Till', text: 'Lifetime', x: 1247, y: 896, size: 24, color: '#0f2454', weight: 'bold', align: 'left' }
    ]
  }
];

export default function CertificateBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templates, setTemplates] = useState<TemplateConfig[]>(INITIAL_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('membership');
  
  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  // Redraw canvas whenever template or fields change
  useEffect(() => {
    if (!activeTemplate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = activeTemplate.src;
    image.onload = () => {
      // Set canvas dimensions to match the image precisely
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw background
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Draw each field
      activeTemplate.fields.forEach(field => {
        ctx.font = `${field.weight} ${field.size}px Roboto, sans-serif`;
        ctx.fillStyle = field.color;
        ctx.textAlign = field.align;
        ctx.textBaseline = 'middle';
        
        // Handle multiline text (like address blocks)
        const lines = field.text.split('\n');
        lines.forEach((line, index) => {
          ctx.fillText(line, field.x, field.y + (index * field.size * 1.2));
        });

        // Draw a small red dot at the exact (x,y) anchor point for debugging/visualizing
        ctx.beginPath();
        ctx.arc(field.x, field.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    };
  }, [activeTemplate]);

  const updateField = (fieldId: string, updates: Partial<FieldConfig>) => {
    setTemplates(prev => prev.map(t => {
      if (t.id !== activeTemplateId) return t;
      return {
        ...t,
        fields: t.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
      };
    }));
  };

  const copyConfigJson = () => {
    if (!activeTemplate) return;
    const configToCopy = activeTemplate.fields.map(f => ({
      name: f.id,
      x: f.x,
      y: f.y,
      size: f.size,
      color: f.color,
      weight: f.weight,
      align: f.align
    }));
    navigator.clipboard.writeText(JSON.stringify(configToCopy, null, 2));
    alert('Configuration copied to clipboard! You can provide this to the backend implementation.');
  };

  if (!activeTemplate) return null;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen bg-gray-100">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 bg-white border-r border-gray-200 overflow-y-auto flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-gray-200 bg-primary text-white">
          <h2 className="text-2xl font-bold">Certificate Builder</h2>
          <p className="text-sm mt-2 opacity-90">Adjust text coordinates visually before saving configuration to backend.</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Template</label>
            <select 
              className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:border-primary focus:ring-0 outline-none transition-colors"
              value={activeTemplateId}
              onChange={(e) => setActiveTemplateId(e.target.value)}
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-8">
            {activeTemplate.fields.map(field => (
              <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-lg text-primary mb-3 pb-2 border-b border-gray-200">{field.label}</h3>
                
                <div className="space-y-4">
                  {/* Sample Text */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Sample Text</label>
                    <input 
                      type="text" 
                      value={field.text}
                      onChange={(e) => updateField(field.id, { text: e.target.value })}
                      className="w-full border border-gray-300 rounded p-1.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* X Coordinate */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">X Position: {field.x}</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        value={field.x}
                        onChange={(e) => updateField(field.id, { x: parseInt(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                    {/* Y Coordinate */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Y Position: {field.y}</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        value={field.y}
                        onChange={(e) => updateField(field.id, { y: parseInt(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {/* Font Size */}
                     <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Font Size: {field.size}px</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        value={field.size}
                        onChange={(e) => updateField(field.id, { size: parseInt(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                     {/* Color */}
                     <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Color</label>
                      <input 
                        type="color" 
                        value={field.color}
                        onChange={(e) => updateField(field.id, { color: e.target.value })}
                        className="w-full h-8 cursor-pointer rounded border border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Alignment */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Alignment</label>
                      <select 
                        value={field.align}
                        onChange={(e) => updateField(field.id, { align: e.target.value as any })}
                        className="w-full border border-gray-300 rounded p-1.5 text-sm"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Weight</label>
                      <select 
                        value={field.weight}
                        onChange={(e) => updateField(field.id, { weight: e.target.value as any })}
                        className="w-full border border-gray-300 rounded p-1.5 text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={copyConfigJson}
            className="w-full mt-8 bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">content_copy</span>
            Copy Final Configuration
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-gray-200 p-4 lg:p-8 overflow-auto flex items-start justify-center">
        <div className="bg-white p-2 shadow-xl border border-gray-300 inline-block">
           <canvas 
             ref={canvasRef} 
             className="max-w-[1000px] w-full h-auto object-contain bg-white"
             style={{ display: 'block' }}
           />
           <p className="text-center text-sm text-gray-500 mt-2 font-medium">The red dots indicate the exact anchor point of the text.</p>
        </div>
      </div>

    </div>
  );
}
