
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptActions } from "./ReceiptActions";
import { TransactionData, generatePrintableReceiptHtml, generateReceiptTextContent } from "./receiptUtils";
import { useTransactionItems } from "@/hooks/useTransactionItems";

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData: TransactionData | null;
}

export const ReceiptViewer = ({ isOpen, onClose, transactionData }: ReceiptViewerProps) => {
  const { toast } = useToast();
  
  // Fetch items from database
  const { data: items = [] } = useTransactionItems(transactionData?.id || null);
  
  // Update items if we have new data from the query
  React.useEffect(() => {
    if (transactionData && isOpen && items.length > 0) {
      transactionData.items = items;
    }
  }, [transactionData, items, isOpen]);
  
  if (!transactionData) return null;
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your popup settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate printable receipt HTML
    const receiptHtml = generatePrintableReceiptHtml(transactionData);
    
    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    
    // Trigger print
    setTimeout(() => {
      printWindow.print();
      // Close after printing
      printWindow.onafterprint = () => printWindow.close();
    }, 500);
  };
  
  const handleDownload = () => {
    // Create a blob with the receipt content
    const receiptText = generateReceiptTextContent(transactionData);
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for transaction has been downloaded.`
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-white">
            <span>Receipt #{transactionData.id.substring(0, 8)}</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700">
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ReceiptContent transactionData={transactionData} />
        <ReceiptActions onPrint={handlePrint} onDownload={handleDownload} />
      </DialogContent>
    </Dialog>
  );
};
