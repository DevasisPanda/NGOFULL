import React from "react";
import { getTemplate, type TemplateConfig } from "@/lib/templates";

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

  // Calculate aspect ratio
  const aspect = template.imgWidth && template.imgHeight ? `${template.imgWidth}/${template.imgHeight}` : "auto";

  // Use localRef and sync with cardRef
  const localRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!cardRef) return;
    if (typeof cardRef === "function") {
      (cardRef as any)(localRef.current);
    } else {
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = localRef.current;
    }
  });

  // Track container width for exact font-size scaling in pixels
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const updateWidth = () => {
      setContainerWidth(el.getBoundingClientRect().width || el.offsetWidth || template.imgWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [template.imgWidth]);

  const activeWidth = containerWidth || template.imgWidth;
  const scaleFactor = activeWidth / template.imgWidth;

  return (
    <div
      ref={localRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{
        aspectRatio: aspect,
        backgroundColor: "#ffffff",
      }}
    >
      <img
        src={template.src}
        alt={template.name}
        className="w-full h-full object-cover pointer-events-none absolute inset-0"
        crossOrigin="anonymous"
      />
      
      {/* Absolute Scaling Overlay Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${template.imgWidth}px`,
            height: `${template.imgHeight}px`,
            left: 0,
            top: 0,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          {template.fields.map((field) => {
            const val = fieldValues[field.id];
            if (val === undefined || val === null || val === "") return null;

            const lines = val.split("\n");

            const style: React.CSSProperties = {
              position: "absolute",
              left: `${field.x}px`,
              top: `${field.y}px`,
              fontSize: `${field.size}px`,
              color: field.color,
              fontWeight: field.weight === "bold" ? "bold" : "normal",
              fontFamily: "Roboto, 'Open Sans', 'Inter', sans-serif",
              textAlign: field.align,
              transform:
                field.align === "center"
                  ? "translate(-50%, -50%)"
                  : field.align === "right"
                  ? "translate(-100%, -50%)"
                  : "translate(0, -50%)",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
              pointerEvents: "none",
            };

            return (
              <span key={field.id} style={style}>
                {lines.map((line, idx) => (
                  <span key={idx} style={{ display: idx > 0 ? "block" : "inline" }}>
                    {line}
                  </span>
                ))}
              </span>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
