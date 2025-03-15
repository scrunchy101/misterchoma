
import { format } from "date-fns";

export interface TransactionData {
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
  isOfflineMode?: boolean;
}

export const generatePrintableReceiptHtml = (transactionData: TransactionData): string => {
  const isOffline = transactionData.isOfflineMode || transactionData.id.startsWith("OFFLINE-");
  const receiptId = isOffline ? "OFFLINE RECEIPT" : `#${transactionData.id}`;
  
  return `
    <html>
      <head>
        <title>Receipt ${receiptId}</title>
        <style>
          body { font-family: monospace; font-size: 12px; max-width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; margin-top: 10px; text-align: right; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          .offline-notice { text-align: center; margin-top: 10px; font-weight: bold; color: #ff0000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mister Choma</h1>
          <p>123 Main Street, Dar es Salaam</p>
          <p>Tel: +255 123 456 789</p>
          <p>Receipt ${receiptId}</p>
          <p>${format(transactionData.date, "MMM d, yyyy h:mm a")}</p>
          <p>Customer: ${transactionData.customer}</p>
          ${isOffline ? '<div class="offline-notice">OFFLINE MODE - NOT STORED IN DATABASE</div>' : ''}
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
};

export const generateReceiptTextContent = (transactionData: TransactionData): string => {
  const isOffline = transactionData.isOfflineMode || transactionData.id.startsWith("OFFLINE-");
  const receiptId = isOffline ? "OFFLINE RECEIPT" : `#${transactionData.id}`;
  
  return `
MISTER CHOMA
123 Main Street, Dar es Salaam
Tel: +255 123 456 789

Receipt ${receiptId}
Date: ${format(transactionData.date, "MMM d, yyyy h:mm a")}
Customer: ${transactionData.customer}
${isOffline ? 'OFFLINE MODE - NOT STORED IN DATABASE' : ''}

${transactionData.items.map(item => 
  `${item.quantity} x ${item.name}`.padEnd(30) + `TZS ${item.price.toLocaleString()}`
).join('\n')}

${''.padEnd(40, '-')}
TOTAL:${' '.repeat(15)}TZS ${transactionData.total.toLocaleString()}
Payment Method: ${transactionData.paymentMethod}

Thank you for dining with us!
Please come again
  `;
};
