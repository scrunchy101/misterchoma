
export interface MenuItemWithQuantity {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  description?: string;
  image_url?: string | null;
}

// Add a helper function to convert between types
export function convertCartItemToMenuItemWithQuantity(cartItem: any): MenuItemWithQuantity {
  return {
    id: cartItem.id,
    name: cartItem.name,
    price: cartItem.price,
    category: cartItem.category || 'default', // Provide a default category if missing
    quantity: cartItem.quantity,
    description: cartItem.description,
    image_url: cartItem.imageUrl || cartItem.image_url
  };
}
