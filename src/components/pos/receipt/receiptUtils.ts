
import { format } from "date-fns";
import { CartItem } from "@/hooks/usePOSSystem";

export interface ReceiptTransaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  employeeName?: string;
}

export const generateReceiptHtml = (transaction: ReceiptTransaction): string => {
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
          ${transaction.employeeName ? `<p>Served by: ${transaction.employeeName}</p>` : ''}
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
};

export const generateReceiptText = (transaction: ReceiptTransaction): string => {
  return `
MISTER CHOMA
123 Main Street, Dar es Salaam
Tel: +255 123 456 789

Receipt #${transaction.id.substring(0, 8)}
Date: ${format(transaction.date, "MMM d, yyyy h:mm a")}
Customer: ${transaction.customer}
${transaction.employeeName ? `Served by: ${transaction.employeeName}` : ''}

${transaction.items.map(item => 
  `${item.quantity} x ${item.name}`.padEnd(30) + `TZS ${item.price.toLocaleString()}`
).join('\n')}

${''.padEnd(40, '-')}
TOTAL:${' '.repeat(15)}TZS ${transaction.total.toLocaleString()}
Payment Method: ${transaction.paymentMethod}

Thank you for dining with us!
Please come again
  `;
};

export const printReceipt = (transaction: ReceiptTransaction): void => {
  const receiptContent = generateReceiptHtml(transaction);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error("Unable to open print window");
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

export const downloadReceipt = (transaction: ReceiptTransaction): void => {
  const receiptText = generateReceiptText(transaction);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${transaction.id.substring(0, 8)}.txt`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
