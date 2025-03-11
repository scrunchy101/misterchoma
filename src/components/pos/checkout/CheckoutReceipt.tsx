
import React from "react";
import { Button } from "@/components/ui/button";
import { ReceiptPreview } from "@/components/pos/receipt/ReceiptPreview";
import { CartItem } from "@/components/pos/types";

interface CheckoutReceiptProps {
  orderId: string | null;
  customerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  paymentMethod: string;
  receiptData: any;
  onClose: () => void;
}

export const CheckoutReceipt: React.FC<CheckoutReceiptProps> = ({
  orderId,
  customerName,
  cartItems,
  cartTotal,
  paymentMethod,
  receiptData,
  onClose,
}) => {
  return (
    <div>
      <ReceiptPreview
        orderId={orderId || ""}
        customerName={receiptData?.customer || customerName || "Guest"}
        items={cartItems}
        total={cartTotal}
        paymentMethod={paymentMethod}
        date={receiptData?.date || new Date()}
      />
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
          Close
        </Button>
      </div>
    </div>
  );
};
