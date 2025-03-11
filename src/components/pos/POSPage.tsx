
import React, { useState } from "react";
import { POSLayout } from "@/components/pos/layout/POSLayout";
import { POSWrapper } from "@/components/pos/POSWrapper";
import { POSTopBar } from "@/components/pos/POSTopBar";
import { POSMenu } from "@/components/pos/menu/POSMenu";
import { POSCart } from "@/components/pos/cart/POSCart";
import { sampleProducts, defaultCategories } from "@/components/pos/data/sampleMenuItems";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [customerName, setCustomerName] = useState("");

  return (
    <POSWrapper>
      <POSLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <POSTopBar />
        <div className="grid grid-cols-3 gap-6 h-full p-4">
          {/* Menu Section */}
          <div className="col-span-2">
            <POSMenu 
              categories={defaultCategories}
              sampleProducts={sampleProducts}
            />
          </div>
          
          {/* Cart Section */}
          <div className="col-span-1">
            <POSCart
              customerName={customerName}
              setCustomerName={setCustomerName}
            />
          </div>
        </div>
      </POSLayout>
    </POSWrapper>
  );
};
