
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReceiptViewer } from "@/components/billing/ReceiptViewer";
import { CustomerInfoSection } from "@/components/pos/checkout/CustomerInfoSection";
import { PaymentMethodSelector } from "@/components/pos/checkout/PaymentMethodSelector";
import { CheckoutActions } from "@/components/pos/checkout/CheckoutActions";
import { useCheckout } from "@/components/pos/hooks/useCheckout";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const {
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
  } = useCheckout(() => onOpenChange(false));

  return (
    <>
      <Dialog open={isOpen && !showReceiptViewer} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the order details to complete checkout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <CustomerInfoSection 
              customerName={customerName}
              setCustomerName={setCustomerName}
              tableNumber={tableNumber}
              setTableNumber={setTableNumber}
            />
            
            <PaymentMethodSelector 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            
            <div className="pt-2">
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>
          
          <CheckoutActions 
            onCancel={() => onOpenChange(false)}
            onCheckout={handleCheckout}
            isProcessingOrder={isProcessingOrder}
          />
        </DialogContent>
      </Dialog>

      {receiptData && (
        <ReceiptViewer 
          isOpen={showReceiptViewer}
          onClose={handleCloseReceipt}
          transactionData={receiptData}
        />
      )}
    </>
  );
};
