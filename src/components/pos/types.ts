
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
    id: cartItem.id || 'unknown-id', // Handle potentially missing ID
    name: cartItem.name,
    price: cartItem.price,
    category: cartItem.category || 'default', // Provide a default category if missing
    quantity: cartItem.quantity,
    description: cartItem.description,
    image_url: cartItem.imageUrl || cartItem.image_url
  };
}

// Convert from any cart item to standard transaction item
export function convertToTransactionItem(item: any) {
  return {
    id: item.id || 'unknown-id',
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  };
}
