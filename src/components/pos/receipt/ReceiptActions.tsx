
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ReceiptActionsProps {
  onPrint: () => void;
  onDownload: () => void;
}

export const ReceiptActions: React.FC<ReceiptActionsProps> = ({ 
  onPrint, 
  onDownload 
}) => {
  return (
    <div className="flex space-x-2 justify-end mt-4">
      <Button 
        variant="outline" 
        onClick={onPrint}
        className="border-gray-600"
      >
        <Printer size={16} className="mr-2" />
        Print Receipt
      </Button>
      <Button 
        variant="default"
        onClick={onDownload}
      >
        <Download size={16} className="mr-2" />
        Download Receipt
      </Button>
    </div>
  );
};
