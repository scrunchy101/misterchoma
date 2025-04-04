
import React, { useEffect } from "react";
import { PaymentProvider, usePayment } from "./PaymentContext";

export interface PaymentProcessorProps {
  children: React.ReactNode;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ children }) => {
  // Log initialization for debugging
  useEffect(() => {
    console.log("Payment processor initialized");
  }, []);

  return (
    <PaymentProvider>
      {children}
    </PaymentProvider>
  );
};

export { usePayment } from './PaymentContext';
