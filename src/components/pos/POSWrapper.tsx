
import React, { ReactNode } from "react";
import { POSProvider } from "@/components/pos/POSContext";
import { Toaster } from "@/components/ui/toaster";

interface POSWrapperProps {
  children: ReactNode;
}

export const POSWrapper = ({ children }: POSWrapperProps) => {
  return (
    <POSProvider>
      {children}
      <Toaster />
    </POSProvider>
  );
};
