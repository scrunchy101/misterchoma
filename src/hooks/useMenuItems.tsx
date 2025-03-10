
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  available: boolean;
}

// Define the category order to match the menu image
const categoryOrder = ["NYAMA CHOMA", "KUKU", "CHIPS", "UGALI", "RICE", "BEVERAGES"];

export const useMenuItems = (category?: string) => {
  return useQuery({
    queryKey: ["menuItems", category],
    queryFn: async (): Promise<MenuItem[]> => {
      let query = supabase
        .from("menu_items")
        .select("*");
      
      // Apply category filter if provided
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching menu items:", error);
        throw new Error(error.message);
      }

      // Sort data first by category order, then by name within each category
      return (data || []).sort((a, b) => {
        const categoryA = categoryOrder.indexOf(a.category);
        const categoryB = categoryOrder.indexOf(b.category);
        
        // If both categories are in our predefined order
        if (categoryA !== -1 && categoryB !== -1) {
          return categoryA - categoryB;
        }
        
        // If only one category is in our predefined order
        if (categoryA !== -1) return -1;
        if (categoryB !== -1) return 1;
        
        // If neither category is in our predefined order, sort alphabetically
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        
        // Sort by name within the same category
        return a.name.localeCompare(b.name);
      });
    }
  });
};
