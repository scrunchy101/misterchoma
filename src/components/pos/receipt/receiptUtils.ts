
import { TransactionData } from "../../billing/receiptUtils";
import { format } from "date-fns";

export function generateReceiptHtml(transaction: TransactionData): string {
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
}

export function generateReceiptText(transaction: TransactionData): string {
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
}
