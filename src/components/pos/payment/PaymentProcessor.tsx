
import React, { useEffect } from "react";
import { PaymentProvider } from "./PaymentContext";

export interface PaymentProcessorProps {
  children: React.ReactNode;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ children }) => {
  return (
    <PaymentProvider>
      {children}
    </PaymentProvider>
  );
};
