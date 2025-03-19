
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const MenuErrorState = ({ error, onRetry }: MenuErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Error Loading Menu</h3>
      <p className="text-gray-400 mb-4">{error}</p>
      <Button onClick={onRetry} variant="default">
        Try Again
      </Button>
    </div>
  );
};
