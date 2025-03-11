
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
  const [imageError, setImageError] = React.useState(false);

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

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-700 h-full bg-gray-800"
    >
      {/* Product Image */}
      <div className="aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
        {item.image_url && !imageError ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="text-gray-500 text-sm flex flex-col items-center p-4">
            <span className="text-gray-400 text-4xl mb-2">🍽️</span>
            <span>No Image</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{item.name}</h3>
        {item.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <p className="font-bold text-white">{formatCurrency(item.price)}</p>
          <button 
            className="flex items-center justify-center p-2 rounded-full bg-green-800 text-green-200 hover:bg-green-700 hover:scale-105 transition-all duration-200"
            onClick={handleAddToCart}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
