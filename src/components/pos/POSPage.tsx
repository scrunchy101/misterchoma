
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { POSProvider } from "./POSContext";
import { CartProvider } from "./cart/CartContext";
import { MenuProvider } from "./menu/MenuContext";
import { PaymentProvider } from "./payment/PaymentContext";
import { MenuGrid } from "./menu/MenuGrid";
import { CategoryFilter } from "./menu/CategoryFilter";
import { CartPanel } from "./cart/CartPanel";
import { CheckoutModal } from "./payment/CheckoutModal";
import { ReceiptModal } from "./receipt/ReceiptModal";
import { Toaster } from "@/components/ui/toaster";
import { ConnectionBanner } from "./ui/ConnectionBanner";

export const POSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const handleCheckout = () => {
    setShowCheckout(true);
  };
  
  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowReceipt(true);
  };

  return (
    <POSProvider>
      <CartProvider>
        <MenuProvider>
          <PaymentProvider>
            <div className="flex h-screen bg-gray-800 text-white">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Point of Sale" />
                
                <ConnectionBanner />
                
                <div className="flex-1 flex overflow-hidden">
                  {/* Menu Section */}
                  <div className="w-2/3 flex flex-col overflow-hidden">
                    <CategoryFilter 
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />
                    <div className="flex-1 overflow-y-auto">
                      <MenuGrid selectedCategory={selectedCategory} />
                    </div>
                  </div>
                  
                  {/* Cart Section */}
                  <div className="w-1/3 border-l border-gray-700 flex flex-col">
                    <CartPanel onCheckout={handleCheckout} />
                  </div>
                </div>
                
                {/* Modals */}
                <CheckoutModal 
                  open={showCheckout}
                  onClose={() => setShowCheckout(false)}
                  onSuccess={handleCheckoutSuccess}
                />
                
                <ReceiptModal
                  open={showReceipt}
                  onClose={() => setShowReceipt(false)}
                />
                
                <Toaster />
              </div>
            </div>
          </PaymentProvider>
        </MenuProvider>
      </CartProvider>
    </POSProvider>
  );
};
