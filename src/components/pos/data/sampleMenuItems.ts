import { MenuItem } from "@/components/pos/types";

export const sampleProducts: MenuItem[] = [
  {
    id: "prod1",
    name: "Beef Ribs",
    price: 15000,
    description: "Slow-cooked tender beef ribs",
    image_url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800&h=500&fit=crop",
    category: "Nyama Choma"
  },
  {
    id: "prod2",
    name: "Goat Meat",
    price: 12000,
    description: "Grilled goat meat with spices",
    image_url: "https://images.unsplash.com/photo-1628294896516-344152572ee8?w=800&h=500&fit=crop",
    category: "Nyama Choma"
  },
  {
    id: "prod3",
    name: "Grilled Chicken",
    price: 10000,
    description: "Whole grilled chicken with spices",
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=500&fit=crop",
    category: "Kuku"
  },
  {
    id: "prod4",
    name: "Chicken Wings",
    price: 8000,
    description: "Spicy grilled chicken wings",
    image_url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=500&fit=crop",
    category: "Kuku"
  },
  {
    id: "prod5",
    name: "Chips Masala",
    price: 5000,
    description: "Fries with special masala seasoning",
    image_url: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&h=500&fit=crop",
    category: "Chips"
  },
  {
    id: "prod6",
    name: "Ugali",
    price: 2000,
    description: "Traditional corn meal dish",
    image_url: "https://images.unsplash.com/photo-1617691763342-d89845944002?w=800&h=500&fit=crop",
    category: "Ugali"
  },
  {
    id: "prod7",
    name: "Pilau Rice",
    price: 4000,
    description: "Spiced rice with aromatic spices",
    image_url: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&h=500&fit=crop",
    category: "Rice"
  },
  {
    id: "prod8",
    name: "Soda",
    price: 1500,
    description: "Assorted soft drinks",
    image_url: "https://images.unsplash.com/photo-1596803244618-8dea939ff49c?w=800&h=500&fit=crop",
    category: "Beverages"
  }
];

export const defaultCategories: string[] = [
  "Nyama Choma", "Kuku", "Chips", "Ugali", "Rice", "Beverages"
];
