
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePayment } from "../payment/PaymentContext";
import { TransactionData } from "../../billing/receiptUtils";
import { useToast } from "@/hooks/use-toast";
import { Printer, Download, X, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

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
        
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
          <div className="text-center mb-3">
            <div className="font-bold text-lg">Mister Choma</div>
            <div className="text-xs text-gray-400">Receipt #{currentTransaction.id.substring(0, 8)}</div>
            <div className="text-xs text-gray-400">{format(currentTransaction.date, 'PPP p')}</div>
          </div>
          
          <div className="border-t border-b border-gray-700 py-2 my-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Customer:</span>
              <span>{currentTransaction.customer}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Payment Method:</span>
              <span>{currentTransaction.paymentMethod}</span>
            </div>
          </div>
          
          <div className="border-b border-gray-700 py-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentTransaction.items.map((item, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="py-1">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{item.price.toLocaleString()}</td>
                    <td className="text-right">{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="py-2 text-right">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>TZS {currentTransaction.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-400 mt-3">
            <div>Thank you for your business!</div>
          </div>
        </div>
        
        <div className="flex space-x-2 justify-end">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="border-gray-600"
          >
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button 
            variant="default"
            onClick={handleDownload}
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions for receipt generation
function generateReceiptHtml(transaction: TransactionData): string {
  return `
    <html>
      <head>
        <title>Receipt #${transaction.id.substring(0, 8)}</title>
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
          <h1>Mister Choma</h1>
          <p>123 Main Street, Dar es Salaam</p>
          <p>Tel: +255 123 456 789</p>
          <p>Receipt #${transaction.id.substring(0, 8)}</p>
          <p>${format(transaction.date, "MMM d, yyyy h:mm a")}</p>
          <p>Customer: ${transaction.customer}</p>
        </div>
        
        <div class="items">
          ${transaction.items.map(item => `
            <div class="item">
              <span>${item.quantity} x ${item.name}</span>
              <span>TZS ${item.price.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="total">
          <p>Total: TZS ${transaction.total.toLocaleString()}</p>
          <p>Payment Method: ${transaction.paymentMethod}</p>
        </div>
        
        <div class="footer">
          <p>Thank you for dining with us!</p>
          <p>Please come again</p>
        </div>
      </body>
    </html>
  `;
}

function generateReceiptText(transaction: TransactionData): string {
  return `
MISTER CHOMA
123 Main Street, Dar es Salaam
Tel: +255 123 456 789

Receipt #${transaction.id.substring(0, 8)}
Date: ${format(transaction.date, "MMM d, yyyy h:mm a")}
Customer: ${transaction.customer}

${transaction.items.map(item => 
  `${item.quantity} x ${item.name}`.padEnd(30) + `TZS ${item.price.toLocaleString()}`
).join('\n')}

${''.padEnd(40, '-')}
TOTAL:${' '.repeat(15)}TZS ${transaction.total.toLocaleString()}
Payment Method: ${transaction.paymentMethod}

Thank you for dining with us!
Please come again
  `;
}
