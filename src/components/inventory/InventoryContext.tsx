
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  status: string;
  cost: number;
  supplier?: string;
  last_updated: string;
}

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: InventoryItem[];
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) throw error;

      // Process the data to match the component's expected format
      const processedItems = data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        stock: Number(item.stock),
        unit: item.unit,
        threshold: Number(item.threshold),
        status: Number(item.stock) > Number(item.threshold) 
          ? 'In Stock' 
          : Number(item.stock) > 0 
            ? 'Low Stock' 
            : 'Out of Stock',
        cost: Number(item.cost),
        supplier: item.supplier,
        last_updated: new Date(item.last_updated).toISOString().split('T')[0]
      }));

      setInventoryItems(processedItems);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('inventory_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'inventory' 
      }, () => {
        fetchInventory();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <InventoryContext.Provider value={{
      inventoryItems,
      loading,
      error,
      searchTerm,
      setSearchTerm,
      filteredItems,
      refreshInventory: fetchInventory
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
