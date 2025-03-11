
import React, { ReactNode } from "react";
import { POSProvider } from "@/components/pos/POSContext";

interface POSWrapperProps {
  children: ReactNode;
}

export const POSWrapper = ({ children }: POSWrapperProps) => {
  return (
    <POSProvider>
      {children}
    </POSProvider>
  );
};
