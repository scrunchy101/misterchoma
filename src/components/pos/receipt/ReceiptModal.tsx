
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";
import { Receipt } from "./Receipt";
import { ReceiptActions } from "./ReceiptActions";
import { printReceipt, downloadReceipt } from "./receiptUtils";
import { TransactionData } from "../../billing/receiptUtils";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: TransactionData;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  open, 
  onClose,
  transaction
}) => {
  if (!transaction) return null;
  
  const handlePrint = () => {
    printReceipt(transaction);
  };
  
  const handleDownload = () => {
    downloadReceipt(transaction);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
              <span>Payment Successful</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Receipt transaction={transaction} />
        
        <ReceiptActions onPrint={handlePrint} onDownload={handleDownload} />
      </DialogContent>
    </Dialog>
  );
};
