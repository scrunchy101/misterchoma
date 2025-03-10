
import React, { useState, useEffect } from "react";
import { POSMenu } from "@/components/pos/POSMenu";
import { CartSection } from "@/components/pos/cart/CartSection";
import { POSLayout } from "@/components/pos/layout/POSLayout";
import { POSWrapper } from "@/components/pos/POSWrapper";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    <POSWrapper>
      <POSLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex h-full">
          {/* Menu Component */}
          <div className="flex-1">
            <POSMenu categories={categories} isLoading={isLoading} />
          </div>
          
          {/* Cart Section Component */}
          <CartSection 
            orderType={orderType}
            setOrderType={setOrderType}
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        </div>
      </POSLayout>
    </POSWrapper>
  );
};
