
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/hooks/useMenuItems";

interface MenuContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: MenuItem[];
  refreshMenu: () => Promise<void>;
  categories: string[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');

      if (error) throw error;

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu data. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('menu_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'menu_items' 
      }, () => {
        fetchMenu();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MenuContext.Provider value={{
      menuItems,
      loading,
      error,
      searchTerm,
      setSearchTerm,
      filteredItems,
      refreshMenu: fetchMenu,
      categories
    }}>
      {children}
    </MenuContext.Provider>
  );
};
