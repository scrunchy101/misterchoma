
import React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionIndicatorProps {
  status: "connected" | "disconnected" | "checking";
  label?: string;
  className?: string;
}

export function ConnectionIndicator({
  status,
  label,
  className
}: ConnectionIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status === "connected" && (
        <>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <Check className="h-4 w-4 text-green-500" />
          <span>{label || "Connected"}</span>
        </>
      )}
      
      {status === "disconnected" && (
        <>
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <X className="h-4 w-4 text-red-500" />
          <span>{label || "Disconnected"}</span>
        </>
      )}
      
      {status === "checking" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <span>{label || "Checking connection..."}</span>
        </>
      )}
    </div>
  );
}
