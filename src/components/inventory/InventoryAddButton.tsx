
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const InventoryAddButton = () => {
  const { toast } = useToast();

  const handleAddItem = () => {
    toast({
      title: "Add Item",
      description: "Add item functionality will be implemented soon.",
    });
  };

  return (
    <Button 
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={handleAddItem}
    >
      <Plus size={16} className="mr-2" />
      Add Item
    </Button>
  );
};
