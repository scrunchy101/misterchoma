
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
}

export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching menu items:", error);
        throw new Error(error.message);
      }

      return data || [];
    }
  });
};
