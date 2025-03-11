
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
      className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200 h-full"
    >
      {/* Product Image */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        {item.image_url && !imageError ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center">
            <span className="text-gray-300 text-2xl mb-1">🍽️</span>
            <span>No Image</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
        {item.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 flex justify-between items-center">
          <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
          <button 
            className="flex items-center justify-center p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            onClick={handleAddToCart}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
