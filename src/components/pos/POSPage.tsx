
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartManager } from "./CartManager";
import { PaymentProcessor } from "./PaymentProcessor";
import { POSContent } from "./POSContent";
import { Toaster } from "@/components/ui/toaster";

export const POSPage = () => {
  const [activeTab, setActiveTab] = React.useState("pos");

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Point of Sale" />
        <CartManager>
          <PaymentProcessor>
            <POSContent />
          </PaymentProcessor>
        </CartManager>
        <Toaster />
      </div>
    </div>
  );
};
