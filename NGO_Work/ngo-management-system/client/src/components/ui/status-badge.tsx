import React from "react";
import { Badge } from "@/components/ui/badge";

export type StatusType = "active" | "pending" | "inactive" | "expired" | "rejected" | "paid" | "unpaid" | "exempted" | "admin" | "user" | "staff" | "volunteer";

interface StatusBadgeProps {
  status: StatusType | string | null | undefined;
  className?: string;
}

/**
 * Standard Status & Role Badge Component
 * Uniform colors, typography, and styling for status indicators across admin and member panels.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let variantStyles = "bg-gray-100 text-gray-700 border-gray-200";

  switch (normalized) {
    case "active":
    case "paid":
      variantStyles = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      break;
    case "pending":
    case "initiated":
      variantStyles = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      break;
    case "exempted":
      variantStyles = "bg-purple-100 text-purple-900 border-purple-300 font-bold";
      break;
    case "inactive":
    case "expired":
    case "unpaid":
      variantStyles = "bg-slate-100 text-slate-700 border-slate-300";
      break;
    case "rejected":
    case "blocked":
      variantStyles = "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      break;
    case "admin":
      variantStyles = "bg-blue-100 text-blue-900 border-blue-300 font-extrabold uppercase";
      break;
    case "staff":
    case "volunteer":
      variantStyles = "bg-teal-100 text-teal-900 border-teal-300 font-semibold capitalize";
      break;
  }

  return (
    <Badge variant="outline" className={`px-2.5 py-0.5 text-xs capitalize ${variantStyles} ${className}`}>
      {status}
    </Badge>
  );
};
