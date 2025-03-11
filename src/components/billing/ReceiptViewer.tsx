
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData: {
    id: string;
    date: Date;
    customer: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod: string;
    total: number;
  } | null;
}

export const ReceiptViewer = ({ isOpen, onClose, transactionData }: ReceiptViewerProps) => {
  const { toast } = useToast();
  
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
    const receiptHtml = `
      <html>
        <head>
          <title>Receipt #${transactionData.id}</title>
          <style>
            body { font-family: monospace; font-size: 12px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; margin-top: 10px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mama's Restaurant</h1>
            <p>123 Main Street, Dar es Salaam</p>
            <p>Tel: +255 123 456 789</p>
            <p>Receipt #${transactionData.id}</p>
            <p>${format(transactionData.date, "MMM d, yyyy h:mm a")}</p>
            <p>Customer: ${transactionData.customer}</p>
          </div>
          
          <div class="items">
            ${transactionData.items.map(item => `
              <div class="item">
                <span>${item.quantity} x ${item.name}</span>
                <span>TZS ${item.price.toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <p>Total: TZS ${transactionData.total.toLocaleString()}</p>
            <p>Payment Method: ${transactionData.paymentMethod}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Please come again</p>
          </div>
        </body>
      </html>
    `;
    
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
    const receiptText = `
MAMA'S RESTAURANT
123 Main Street, Dar es Salaam
Tel: +255 123 456 789

Receipt #${transactionData.id}
Date: ${format(transactionData.date, "MMM d, yyyy h:mm a")}
Customer: ${transactionData.customer}

${transactionData.items.map(item => 
  `${item.quantity} x ${item.name}`.padEnd(30) + `TZS ${item.price.toLocaleString()}`
).join('\n')}

${''.padEnd(40, '-')}
TOTAL:${' '.repeat(15)}TZS ${transactionData.total.toLocaleString()}
Payment Method: ${transactionData.paymentMethod}

Thank you for dining with us!
Please come again
    `;
    
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
      description: `Receipt for transaction ${transactionData.id} has been downloaded.`
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Receipt #{transactionData.id}</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-md p-4 font-mono text-sm">
          <div className="text-center mb-4">
            <div className="font-bold text-lg">Mama's Restaurant</div>
            <div className="text-xs text-gray-500">123 Main Street, Dar es Salaam</div>
            <div className="text-xs text-gray-500">Tel: +255 123 456 789</div>
            <div className="text-xs mt-2">{format(transactionData.date, "MMM d, yyyy h:mm a")}</div>
            <div className="text-xs">Customer: {transactionData.customer}</div>
          </div>
          
          <div className="border-t border-b border-dashed border-gray-200 py-2 space-y-1">
            {transactionData.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.quantity} x {item.name}</span>
                <span>TZS {item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-right font-bold">
            <div>Total: TZS {transactionData.total.toLocaleString()}</div>
            <div className="text-xs font-normal">Payment Method: {transactionData.paymentMethod}</div>
          </div>
          
          <div className="text-center text-xs mt-4 text-gray-500">
            <div>Thank you for dining with us!</div>
            <div>Please come again</div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
