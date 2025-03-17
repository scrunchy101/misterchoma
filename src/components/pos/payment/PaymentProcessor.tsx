
import React, { useEffect } from "react";
import { PaymentProcessorProps } from "./types";
import { PaymentContext } from "./PaymentContext";
import { usePaymentProcessor } from "./usePaymentProcessor";

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ children }) => {
  const {
    processPayment,
    currentTransaction,
    setCurrentTransaction,
    connectionStatus,
    checkConnection
  } = usePaymentProcessor();

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const value = {
    processPayment,
    currentTransaction,
    setCurrentTransaction,
    connectionStatus,
    checkConnection
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
