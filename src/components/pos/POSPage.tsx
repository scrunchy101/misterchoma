
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { POSMenu } from "@/components/pos/POSMenu";
import { POSCart } from "@/components/pos/POSCart";
import { POSTopBar } from "@/components/pos/POSTopBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { POSProvider } from "@/components/pos/POSContext";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in' | 'pickup'>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('category')
          .order('category');
          
        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load menu categories",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  return (
    <POSProvider>
      <div className="flex h-screen bg-white text-gray-800">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <Header title="Point of Sale" />
          
          {/* POS Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Menu Section (Left) */}
            <div className="w-2/3 flex flex-col">
              {/* Top Bar with action buttons */}
              <POSTopBar />
              
              {/* Menu content */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <POSMenu categories={categories} isLoading={isLoading} />
              </div>
            </div>
            
            {/* Cart Section (Right) */}
            <div className="w-1/3 bg-white p-4 overflow-y-auto border-l border-gray-200 flex flex-col">
              {/* Order Type Selector */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  className={`px-4 py-2 text-center rounded ${orderType === 'delivery' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setOrderType('delivery')}
                >
                  Delivery
                </button>
                <button 
                  className={`px-4 py-2 text-center rounded ${orderType === 'dine-in' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  Dine-in
                </button>
                <button 
                  className={`px-4 py-2 text-center rounded ${orderType === 'pickup' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setOrderType('pickup')}
                >
                  Pickup
                </button>
              </div>
              
              {/* Customer Input */}
              <div className="flex mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Walk-in Customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-l py-2 px-3"
                  />
                  {customerName && (
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setCustomerName('')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <button className="bg-green-500 text-white px-4 rounded-r border border-green-500 flex items-center justify-center">
                  +&nbsp;Customer
                </button>
              </div>
              
              {/* Order Timing */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="bg-red-500 text-white py-2 rounded">
                  Now
                </button>
                <button className="bg-gray-200 text-gray-800 py-2 rounded">
                  Schedule for later
                </button>
              </div>
              
              {/* Cart Items */}
              <POSCart orderType={orderType} customerName={customerName} />
            </div>
          </div>
        </div>
      </div>
    </POSProvider>
  );
};
