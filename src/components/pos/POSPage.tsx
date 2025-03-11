
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { POSMenu } from "@/components/pos/POSMenu";
import { POSCart } from "@/components/pos/POSCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { POSProvider } from "@/components/pos/POSContext";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="flex h-screen bg-gray-800 text-white">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <Header title="Point of Sale" />
          
          {/* POS Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Menu Section (Left) */}
            <div className="w-2/3 overflow-y-auto p-4">
              <POSMenu categories={categories} isLoading={isLoading} />
            </div>
            
            {/* Cart Section (Right) */}
            <div className="w-1/3 bg-gray-700 p-4 overflow-y-auto border-l border-gray-600">
              <POSCart />
            </div>
          </div>
        </div>
      </div>
    </POSProvider>
  );
};
