
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "../cart/CartContext";

export interface MenuContextType {
  items: MenuItem[];
  categories: string[];
  isLoading: boolean;
  error: Error | null;
  fetchMenuItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name');
      
      if (supabaseError) throw new Error(supabaseError.message);
      
      if (data) {
        setItems(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(uniqueCategories);
        
        console.log("Menu items loaded:", data.length);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Failed to load menu items:", error);
      setError(error);
      
      toast({
        title: "Error Loading Menu",
        description: "Could not load menu items from the database.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <MenuContext.Provider value={{ items, categories, isLoading, error, fetchMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
