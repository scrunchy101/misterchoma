
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InventorySearchBar } from "./InventorySearchBar";
import { InventoryTable } from "./InventoryTable";
import { InventoryLoadingState } from "./InventoryLoadingState";
import { InventoryErrorState } from "./InventoryErrorState";
import { InventoryEmptyState } from "./InventoryEmptyState";

interface InventoryItem {
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

export const InventoryList = () => {
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
  }, [toast]);

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return <InventoryLoadingState />;
    }

    if (error) {
      return <InventoryErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    if (filteredItems.length === 0) {
      return <InventoryEmptyState isEmpty={inventoryItems.length === 0} />;
    }

    return <InventoryTable items={filteredItems} />;
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Inventory Items</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      <InventorySearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      {renderContent()}
    </div>
  );
};
