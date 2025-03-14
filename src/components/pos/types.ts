
export interface MenuItemWithQuantity {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  description?: string;
  image_url?: string | null;
}
