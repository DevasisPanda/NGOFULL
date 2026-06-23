import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageDown, FileDown } from "lucide-react";
import { toast } from "sonner";

let html2canvas: any = null;
let jsPDF: any = null;

async function ensureLibraries() {
  if (!html2canvas) {
    // html2canvas-pro supports oklch(), lab(), lch() etc. that Tailwind v4 uses
    const mod = await import("html2canvas-pro");
    html2canvas = mod.default;
  }
  if (!jsPDF) {
    const mod = await import("jspdf");
    jsPDF = mod.default;
  }
}

export function useCapture(filename: string = "document") {
  const ref = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState<"jpg" | "pdf" | null>(null);

  const capture = useCallback(
    async (format: "jpg" | "pdf") => {
      const el = ref.current;
      if (!el) {
        toast.error("Content not found");
        return;
      }

      setCapturing(format);
      try {
        await ensureLibraries();

        const canvas = await html2canvas(el, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        if (format === "jpg") {
          const link = document.createElement("a");
          link.download = `${filename}.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.95);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(`JPG saved as ${filename}.jpg`);
        } else {
          // Use PNG (lossless) for PDF sharpness
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
          pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
          pdf.save(`${filename}.pdf`);
          toast.success(`PDF saved as ${filename}.pdf`);
        }
      } catch (err: any) {
        toast.error(`Failed to capture: ${err.message}`);
      } finally {
        setCapturing(null);
      }
    },
    [filename]
  );

  return { ref, capture, capturing };
}

interface CaptureActionsProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
  className?: string;
}

export function CaptureActions({ cardRef, filename = "document", className = "" }: CaptureActionsProps) {
  const [loading, setLoading] = useState<"jpg" | "pdf" | null>(null);

  const handleCapture = async (format: "jpg" | "pdf") => {
    const el = cardRef.current;
    if (!el) {
      toast.error("Content not found");
      return;
    }

    setLoading(format);
    try {
      await ensureLibraries();

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      if (format === "jpg") {
        const link = document.createElement("a");
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`JPG saved as ${filename}.jpg`);
      } else {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${filename}.pdf`);
        toast.success(`PDF saved as ${filename}.pdf`);
      }
    } catch (err: any) {
      toast.error(`Failed to capture: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        disabled={loading === "jpg"}
        onClick={() => handleCapture("jpg")}
      >
        <ImageDown className="w-3.5 h-3.5" />
        {loading === "jpg" ? "Saving..." : "JPG"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1"
        disabled={loading === "pdf"}
        onClick={() => handleCapture("pdf")}
      >
        <FileDown className="w-3.5 h-3.5" />
        {loading === "pdf" ? "Saving..." : "PDF"}
      </Button>
    </div>
  );
}
