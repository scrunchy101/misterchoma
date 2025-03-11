
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfoSection } from "@/components/pos/checkout/CustomerInfoSection";
import { PaymentMethodSelector } from "@/components/pos/checkout/PaymentMethodSelector";
import { CheckoutActions } from "@/components/pos/checkout/CheckoutActions";

interface CheckoutFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  onCheckout: () => Promise<void>;
  onCancel: () => void;
  isProcessingOrder: boolean;
  cartTotal: number;
  processingError: string | null;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerName,
  setCustomerName,
  tableNumber,
  setTableNumber,
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  onCheckout,
  onCancel,
  isProcessingOrder,
  cartTotal,
  processingError,
}) => {
  return (
    <div className="space-y-4">
      <CustomerInfoSection 
        customerName={customerName}
        setCustomerName={setCustomerName}
        tableNumber={tableNumber} 
        setTableNumber={setTableNumber} 
      />
      
      <div className="space-y-4 mt-4">
        <PaymentMethodSelector 
          value={paymentMethod} 
          onChange={setPaymentMethod} 
        />
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
            Order Notes
          </label>
          <Textarea 
            id="notes"
            placeholder="Any special instructions or notes for this order"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
        </div>
      </div>
      
      {processingError && (
        <div className="mt-4 p-2 bg-red-900/50 border border-red-700 rounded-md text-white text-sm">
          <p className="font-medium">Error processing order:</p>
          <p>{processingError}</p>
          <p className="text-xs mt-1">Please check the console for more details.</p>
        </div>
      )}
      
      <CheckoutActions 
        onCheckout={onCheckout} 
        onCancel={onCancel}
        total={cartTotal}
        isProcessing={isProcessingOrder}
      />
    </div>
  );
};
