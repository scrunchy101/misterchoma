
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "./MenuContext";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemForm, MenuItemFormValues } from "./MenuItemForm";
import { MenuItem } from "@/hooks/useMenuItems";

interface MenuAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Empty default menu item for the add form
const emptyMenuItem: MenuItem = {
  id: "",
  name: "",
  category: "",
  price: 0,
  description: "",
  available: true,
  image_url: "",
};

export const MenuAddDialog = ({ isOpen, onOpenChange }: MenuAddDialogProps) => {
  const { toast } = useToast();
  const { refreshMenu } = useMenu();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: MenuItemFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description || null,
          available: data.available,
          image_url: data.image_url || null,
        });
        
      if (error) throw error;
      
      await refreshMenu();
      
      toast({
        title: "Menu Item Added",
        description: `${data.name} has been added to the menu successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>
        
        <MenuItemForm 
          defaultValues={emptyMenuItem}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          submitButtonText="Add Item"
          cancelButtonText="Cancel"
        />
      </DialogContent>
    </Dialog>
  );
};
