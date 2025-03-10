
import { supabase } from "@/integrations/supabase/client";
import { MenuItemFormValues } from "./MenuItemForm";

export const updateMenuItem = async (itemId: string, data: MenuItemFormValues) => {
  const { error } = await supabase
    .from('menu_items')
    .update({
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || null,
      available: data.available,
      image_url: data.image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId);
    
  if (error) throw error;
  
  return { success: true };
};

export const createMenuItem = async (data: MenuItemFormValues) => {
  const { error } = await supabase
    .from('menu_items')
    .insert({
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description || null,
      available: data.available,
      image_url: data.image_url || null,
    });
    
  if (error) throw error;
  
  return { success: true };
};
