
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePayment } from "../payment/PaymentContext";
import { TransactionData } from "../../billing/receiptUtils";
import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle2 } from "lucide-react";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptActions } from "./ReceiptActions";
import { generateReceiptHtml, generateReceiptText } from "./receiptUtils";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onClose }) => {
  const { currentTransaction, clearTransaction } = usePayment();
  const { toast } = useToast();
  
  if (!currentTransaction) return null;
  
  const handlePrint = () => {
    const receiptContent = generateReceiptHtml(currentTransaction);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 500);
  };
  
  const handleDownload = () => {
    const receiptText = generateReceiptText(currentTransaction);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${currentTransaction.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: "Receipt has been downloaded successfully."
    });
  };
  
  const handleClose = () => {
    clearTransaction();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
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
              onClick={handleClose} 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ReceiptContent transaction={currentTransaction} />
        
        <ReceiptActions onPrint={handlePrint} onDownload={handleDownload} />
      </DialogContent>
    </Dialog>
  );
};
