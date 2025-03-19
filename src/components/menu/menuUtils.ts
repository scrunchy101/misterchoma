
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

// Updated menu items based on the image
export const populateMisterChomaMenu = async () => {
  // First delete all existing menu items
  await deleteAllMenuItems();
  
  // Define menu items from the Mister Choma menu image
  const menuItems = [
    // NYAMA CHOMA category
    { name: "NYAMA CHOMA (1/4 KG)", category: "NYAMA CHOMA", price: 6000, description: "Quarter kilogram of grilled meat" },
    { name: "MBUZI CHOMA (1/4 KG)", category: "NYAMA CHOMA", price: 7000, description: "Quarter kilogram of grilled goat meat" },
    { name: "MBUZI CHOMA (1/2 KG)", category: "NYAMA CHOMA", price: 14000, description: "Half kilogram of grilled goat meat" },
    { name: "MBUZI CHOMA (1 KG)", category: "NYAMA CHOMA", price: 28000, description: "One kilogram of grilled goat meat" },
    { name: "KIBANJA CHA MBUZI", category: "NYAMA CHOMA", price: 8000, description: "Goat ribs" },
    { name: "KITIMOTO", category: "NYAMA CHOMA", price: 8000, description: "Spicy meat dish" },
    { name: "MISHKAKI MBUZI (1)", category: "NYAMA CHOMA", price: 3000, description: "Single goat meat skewer" },
    { name: "MISHKAKI MBUZI (6)", category: "NYAMA CHOMA", price: 17000, description: "Six goat meat skewers" },
    { name: "GIZZARD", category: "NYAMA CHOMA", price: 3000, description: "Grilled chicken gizzards" },
    
    // KUKU category
    { name: "KUKU CHOMA (1/4)", category: "KUKU", price: 8000, description: "Quarter grilled chicken" },
    { name: "KUKU CHOMA (1/2)", category: "KUKU", price: 15000, description: "Half grilled chicken" },
    { name: "KUKU FLAY CHOMA", category: "KUKU", price: 28000, description: "Whole flat grilled chicken" },
    { name: "KUKU KICHUNGI", category: "KUKU", price: 28000, description: "Specially prepared chicken" },
    { name: "FISH FRY", category: "KUKU", price: 15000, description: "Fried fish" },
    
    // CHIPS category
    { name: "CHIPS PLAIN", category: "CHIPS", price: 3000, description: "Plain french fries" },
    { name: "CHIPS & SAUSAGE", category: "CHIPS", price: 6000, description: "French fries with sausage" },
    { name: "CHIPS & KUKU (1/4)", category: "CHIPS", price: 10000, description: "French fries with quarter chicken" },
    { name: "CHIPS & KUKU (1/2)", category: "CHIPS", price: 16000, description: "French fries with half chicken" },
    { name: "CHIPS & NYAMA", category: "CHIPS", price: 8000, description: "French fries with meat" },
    { name: "CHIPS MASALA", category: "CHIPS", price: 5000, description: "Spiced french fries" },
    { name: "CHIPS MAYAI", category: "CHIPS", price: 5000, description: "French fries with eggs" },
    
    // UGALI category
    { name: "UGALI & MAHARAGE", category: "UGALI", price: 3000, description: "Cornmeal porridge with beans" },
    { name: "UGALI & NYAMA", category: "UGALI", price: 7000, description: "Cornmeal porridge with meat" },
    { name: "UGALI & NDIZI NYAMA", category: "UGALI", price: 7000, description: "Cornmeal porridge with plantains and meat" },
    { name: "NDIZI NYAMA", category: "UGALI", price: 7000, description: "Plantains with meat" },
    
    // RICE category
    { name: "RICE PLAIN", category: "RICE", price: 2000, description: "Plain white rice" },
    { name: "RICE & BEANS", category: "RICE", price: 3000, description: "Rice with beans" },
    { name: "RICE & NYAMA", category: "RICE", price: 7000, description: "Rice with meat" },
    { name: "RICE & FISH", category: "RICE", price: 10000, description: "Rice with fish" },
    { name: "RICE & KUKU (1/4)", category: "RICE", price: 10000, description: "Rice with quarter chicken" },
    { name: "BIRIANI YA KUKU (1/4)", category: "RICE", price: 10000, description: "Chicken biryani with quarter chicken" },
    { name: "PILAU NYAMA", category: "RICE", price: 5000, description: "Spiced rice with meat" },
    { name: "PILAU YA KUKU (1/4)", category: "RICE", price: 10000, description: "Spiced rice with quarter chicken" },
    
    // BEVERAGES category
    { name: "SODA", category: "BEVERAGES", price: 1000, description: "Soft drink" },
    { name: "WATER", category: "BEVERAGES", price: 1000, description: "Bottled water" },
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

// Immediately populate menu on system initialization
(async () => {
  try {
    // Check if menu is empty before populating
    const { data, error } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error("Error checking menu items:", error);
      return;
    }
    
    // If no menu items exist, populate with Mister Choma menu
    if (data.length === 0) {
      console.log("Initializing menu with Mister Choma items");
      await populateMisterChomaMenu();
      console.log("Menu initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing menu:", error);
  }
})();
