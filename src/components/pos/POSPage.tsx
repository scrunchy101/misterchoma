
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartManager } from "./CartManager";
import { PaymentProcessor } from "./PaymentProcessor";
import { POSContent } from "./POSContent";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState("pos");

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
      </div>
    </div>
  );
};
