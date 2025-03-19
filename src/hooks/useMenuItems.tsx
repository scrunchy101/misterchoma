
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  available: boolean; // Added this property to fix the TypeScript errors
}

export const useMenuItems = (category?: string) => {
  return useQuery({
    queryKey: ["menuItems", category],
    queryFn: async (): Promise<MenuItem[]> => {
      let query = supabase
        .from("menu_items")
        .select("*")
        .order("name");
      
      // Apply category filter if provided
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching menu items:", error);
        throw new Error(error.message);
      }

      return data || [];
    }
  });
};
