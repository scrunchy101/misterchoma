
import React, { useEffect } from "react";
import { PaymentProvider } from "./PaymentContext";
import { useAuth } from "@/context/AuthContext";

export interface PaymentProcessorProps {
  children: React.ReactNode;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ children }) => {
  const { profile } = useAuth();
  
  // Log the current user's role for debugging
  useEffect(() => {
    if (profile) {
      console.log(`Payment processor initialized for user: ${profile.full_name}, role: ${profile.role}`);
    }
  }, [profile]);

  return (
    <PaymentProvider>
      {children}
    </PaymentProvider>
  );
};
