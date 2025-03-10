
import React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MenuItem } from "../types";
import { usePOSContext } from "../POSContext";
import { useToast } from "@/hooks/use-toast";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addItemToCart, formatCurrency } = usePOSContext();
  const { toast } = useToast();

  const handleAddToCart = () => {
    console.log("Adding to cart:", item);
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
    
    toast({
      title: "Added to order",
      description: `${item.name} added to your order`
    });
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {item.image_url || (item as any).image ? (
          <img 
            src={(item as any).image || item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        {item.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 flex justify-between items-center">
          <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={handleAddToCart}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </Card>
  );
};
