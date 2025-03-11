
import { useState } from "react";
import { usePOSContext } from "@/components/pos/POSContext";
import { TransactionData } from "@/components/billing/receiptUtils";

export const useCheckout = (onClose: () => void) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, formatCurrency } = usePOSContext();
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionData | null>(null);

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: customerName || "Walk-in Customer",
      tableNumber: tableNumber ? Number(tableNumber) : null,
      paymentMethod: paymentMethod
    });
    
    if (success) {
      setReceiptData({
        id: `ORDER-${Math.floor(Math.random() * 10000)}`,
        date: new Date(),
        customer: customerName || "Walk-in Customer",
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity
        })),
        paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        total: cartTotal
      });
      
      setShowReceiptViewer(true);
      
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod("cash");
    }
  };

  const handleCloseReceipt = () => {
    setShowReceiptViewer(false);
    onClose();
  };

  return {
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
    paymentMethod,
    setPaymentMethod,
    showReceiptViewer,
    receiptData,
    cartTotal,
    formatCurrency,
    isProcessingOrder,
    handleCheckout,
    handleCloseReceipt
  };
};
