
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

export const deleteAllMenuItems = async () => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all items
    
  if (error) throw error;
  
  return { success: true };
};

export const populateMisterChomaMenu = async () => {
  // First delete all existing menu items
  await deleteAllMenuItems();
  
  // Define menu items from the Mister Choma menu
  const menuItems = [
    // Chips category
    { name: "CHIPS KAVU", category: "CHIPS", price: 2000, description: "Plain chips (fries)" },
    { name: "CHIPS MAYAI", category: "CHIPS", price: 3000, description: "Chips with eggs" },
    { name: "CHIPS T-BONE (PANDE)", category: "CHIPS", price: 5000, description: "Chips with T-bone steak" },
    { name: "CHIPS KUKU (ROBO)", category: "CHIPS", price: 5000, description: "Chips with quarter chicken" },
    { name: "KUKU CHOMA (NUSU)", category: "CHIPS", price: 7000, description: "Half grilled chicken" },
    { name: "KUKU SEKELA (NUSU)", category: "CHIPS", price: 7000, description: "Half fried chicken" },
    { name: "T-BONE PANDE", category: "CHIPS", price: 3000, description: "T-bone steak" },
    { name: "MISHKAKI BEEF", category: "CHIPS", price: 1000, description: "Beef skewers" },
    { name: "NYAMA YA FOIL", category: "CHIPS", price: 5000, description: "Foil-wrapped meat" },
    { name: "SUPU YA NYAMA", category: "CHIPS", price: 3000, description: "Meat soup" },
    { name: "CHAPATI/MANDAZI", category: "CHIPS", price: 500, description: "Flatbread/Sweet fried bread" },
    
    // Ugali category
    { name: "UGALI NYAMA", category: "UGALI", price: 3500, description: "Ugali with meat" },
    { name: "UGALI T-BONE", category: "UGALI", price: 4000, description: "Ugali with T-bone steak" },
    { name: "UGALI SAMAKI", category: "UGALI", price: 5000, description: "Ugali with fish" },
    
    // Wali category
    { name: "WALI NYAMA", category: "WALI", price: 3500, description: "Rice with meat" },
    { name: "WALI KUKU", category: "WALI", price: 5000, description: "Rice with chicken" },
    { name: "WALI T-BONE", category: "WALI", price: 5500, description: "Rice with T-bone steak" },
    { name: "WALI SAMAKI", category: "WALI", price: 6000, description: "Rice with fish" },
    
    // Ijumaa Spesho (Friday Special) category
    { name: "PILAU NYAMA (IJUMAA)", category: "IJUMAA SPESHO", price: 5500, description: "Spiced rice with meat (Friday special)" },
    { name: "BIRIANI NYAMA (IJUMAA)", category: "IJUMAA SPESHO", price: 5500, description: "Biryani with meat (Friday special)" },
    { name: "BIRIANI KUKU (IJUMAA)", category: "IJUMAA SPESHO", price: 7000, description: "Biryani with chicken (Friday special)" },
  ];
  
  // Insert all menu items
  for (const item of menuItems) {
    await createMenuItem({
      ...item,
      available: true,
      image_url: ""
    });
  }
  
  return { success: true, count: menuItems.length };
};
