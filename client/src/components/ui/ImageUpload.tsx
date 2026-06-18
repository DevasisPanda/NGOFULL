import React, { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className = "", label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      setIsUploading(false);
      toast.success("Image uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error(error.message || "Upload failed");
    }
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      uploadMutation.mutate({
        base64,
        filename: file.name
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div 
        className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all 
          ${value ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-blue-400 bg-white cursor-pointer"}
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
        onClick={() => !value && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-8 text-blue-500">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : value ? (
          <div className="relative group">
            <img 
              src={value} 
              alt="Uploaded preview" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={clearImage}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
