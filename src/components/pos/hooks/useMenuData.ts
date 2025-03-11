
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "../types";

// Sample products with images for the demo
const sampleProducts = [
  {
    id: "prod1",
    name: "Hot Fudge Sundae",
    price: 40.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
    category: "Desserts & Drinks"
  },
  {
    id: "prod2",
    name: "Hot Caramel Sundae",
    price: 32.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
    category: "Desserts & Drinks"
  },
  {
    id: "prod3",
    name: "McFlurry w/ Oreo",
    price: 53.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
    category: "Desserts & Drinks"
  },
  {
    id: "prod4",
    name: "ItemBurger",
    price: 10.00,
    description: "test",
    image: "",
    category: "Group Meals"
  },
  {
    id: "prod5",
    name: "baklava",
    price: 7000.00,
    description: "",
    image: "",
    category: "Breakfast"
  },
  {
    id: "prod6",
    name: "test item",
    price: 6.49,
    description: "sdfasdf",
    image: "",
    category: "Featured"
  }
];

export const useMenuData = (categories: string[]) => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Set active category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory("Desserts & Drinks");
    }
  }, [categories, activeCategory]);

  // Fetch menu items when active category changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      // For demo purposes, using sample products
      setIsMenuLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (searchQuery) {
          const filtered = sampleProducts.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMenuItems(filtered as MenuItem[]);
        } else {
          setMenuItems(sampleProducts as MenuItem[]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive"
        });
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory, searchQuery, toast]);

  // Sample categories based on the image
  const filteredCategories = ["Desserts & Drinks", "Group Meals", "Rice Bowls", "Breakfast", "Featured"];

  return {
    menuItems,
    isMenuLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredCategories
  };
};
