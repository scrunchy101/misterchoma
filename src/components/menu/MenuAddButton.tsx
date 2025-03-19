
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuAddDialog } from "./MenuAddDialog";

export const MenuAddButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus size={16} className="mr-2" />
        Add Item
      </Button>
      
      <MenuAddDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};
