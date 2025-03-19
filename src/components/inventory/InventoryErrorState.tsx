
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InventoryErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const InventoryErrorState = ({ error, onRetry }: InventoryErrorStateProps) => {
  return (
    <Card className="p-6 bg-red-900/20 border-red-800">
      <div className="flex items-center gap-2 text-red-400">
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
      <Button 
        variant="outline" 
        className="mt-4 border-red-700 text-red-400 hover:bg-red-950"
        onClick={onRetry}
      >
        Retry
      </Button>
    </Card>
  );
};
