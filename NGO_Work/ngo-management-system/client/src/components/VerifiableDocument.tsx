import React, { useEffect, useRef } from "react";
import { getTemplate } from "@/lib/templates";

interface VerifiableDocumentProps {
  templateId: string;
  fieldValues: Record<string, string>;
  dbTemplates?: any[];
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  children?: React.ReactNode;
}

export function VerifiableDocument({
  templateId,
  fieldValues,
  dbTemplates,
  cardRef,
  className = "",
  children,
}: VerifiableDocumentProps) {
  // 1. Get static template
  const staticTpl = getTemplate(templateId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync refs
  useEffect(() => {
    if (!cardRef) return;
    if (typeof cardRef === "function") {
      (cardRef as any)(containerRef.current);
    } else {
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
    }
  });

  if (!staticTpl) {
    return (
      <div className="p-4 text-red-500 font-bold border border-red-200 bg-red-50 rounded">
        Template "{templateId}" not found
      </div>
    );
  }

  // 2. Merge with dbTemplates
  let template = staticTpl;
  if (dbTemplates) {
    const dbTpl = dbTemplates.find((t) => t.type === templateId);
    if (dbTpl) {
      let fields = staticTpl.fields;
      try {
        if (typeof dbTpl.designJson === "string") {
          fields = JSON.parse(dbTpl.designJson);
        } else if (dbTpl.designJson && typeof dbTpl.designJson === "object") {
          fields = dbTpl.designJson as any;
        }
      } catch (e) {
        console.error("Failed to parse designJson for template", dbTpl.type, e);
      }
      template = {
        ...staticTpl,
        src: dbTpl.templateImage || staticTpl.src,
        fields,
      };
    }
  }

  // Redraw canvas whenever template or fieldValues change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = template.src;
    image.onload = () => {
      const imgWidth = template.imgWidth || image.naturalWidth || image.width || 1200;
      const imgHeight = template.imgHeight || image.naturalHeight || image.height || 850;

      canvas.width = imgWidth;
      canvas.height = imgHeight;
      
      // Draw background
      ctx.drawImage(image, 0, 0, imgWidth, imgHeight);

      // Draw each field
      template.fields.forEach((field) => {
        const val = fieldValues[field.id];
        if (val === undefined || val === null || val === "") return;

        ctx.font = `${field.weight === "bold" ? "bold" : "normal"} ${field.size}px Roboto, 'Open Sans', 'Inter', sans-serif`;
        ctx.fillStyle = field.color;
        ctx.textAlign = field.align;
        ctx.textBaseline = "middle";

        const lines = val.split("\n");
        lines.forEach((line, index) => {
          ctx.fillText(line, field.x, field.y + index * field.size * 1.2);
        });
      });
    };
  }, [template, fieldValues]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-white ${className}`}
      style={{
        aspectRatio: template.imgWidth && template.imgHeight ? `${template.imgWidth}/${template.imgHeight}` : "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-contain bg-white block"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
      {children}
    </div>
  );
}
