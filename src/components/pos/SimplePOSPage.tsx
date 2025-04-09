
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimpleMenu } from "./SimpleMenu";
import { SimpleCart } from "./SimpleCart";
import { SimpleCheckout } from "./SimpleCheckout";
import { SimpleReceipt } from "./SimpleReceipt";
import { POSConnectionStatus } from "./POSConnectionStatus";
import { POSAlerts } from "./POSAlerts";
import { usePOSLogic } from "@/hooks/pos/usePOSLogic";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
}

export const SimplePOSPage: React.FC = () => {
  const {
    cart,
    selectedCategory,
    setSelectedCategory,
    isOnline,
    connected,
    primaryDb,
    isCheckingConnection,
    showCheckout,
    setShowCheckout,
    showReceipt,
    setShowReceipt,
    transaction,
    connectionError,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    checkConnection,
    processOrder
  } = usePOSLogic();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab="pos" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Point of Sale" />
        
        <POSConnectionStatus
          isCheckingConnection={isCheckingConnection}
          connected={connected}
          primaryDb={primaryDb}
          connectionError={connectionError}
          checkConnection={checkConnection}
        />
        
        <POSAlerts
          isOnline={isOnline}
          connected={connected}
          isCheckingConnection={isCheckingConnection}
          connectionError={connectionError}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-2/3 flex flex-col overflow-hidden">
            <SimpleMenu 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddToCart={addToCart}
            />
          </div>
          
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <SimpleCart 
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={() => setShowCheckout(true)}
              total={calculateTotal()}
            />
          </div>
        </div>
        
        {showCheckout && (
          <SimpleCheckout
            total={calculateTotal()}
            onClose={() => setShowCheckout(false)}
            onConfirm={processOrder}
            isConnected={connected && isOnline}
          />
        )}
        
        {showReceipt && transaction && (
          <SimpleReceipt
            transaction={transaction}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    </div>
  );
};
