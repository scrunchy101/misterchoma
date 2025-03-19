
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ReceiptActionsProps {
  onPrint: () => void;
  onDownload: () => void;
}

export const ReceiptActions: React.FC<ReceiptActionsProps> = ({ onPrint, onDownload }) => {
  return (
    <div className="flex justify-end space-x-2 mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrint} 
        className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
      >
        <Printer size={16} className="mr-2" />
        Print
      </Button>
      <Button 
        size="sm" 
        onClick={onDownload} 
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Download size={16} className="mr-2" />
        Download
      </Button>
    </div>
  );
};
