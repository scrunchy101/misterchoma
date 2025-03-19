
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "./MenuContext";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/hooks/useMenuItems";
import { MenuItemForm } from "./MenuItemForm";
import { updateMenuItem } from "./menuUtils";

interface MenuEditDialogProps {
  item: MenuItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MenuEditDialog = ({ item, isOpen, onOpenChange }: MenuEditDialogProps) => {
  const { toast } = useToast();
  const { refreshMenu } = useMenu();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      await updateMenuItem(item.id, formData);
      await refreshMenu();
      
      toast({
        title: "Menu Item Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
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
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        
        <MenuItemForm 
          defaultValues={item}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          submitButtonText="Save Changes"
          cancelButtonText="Cancel"
        />
      </DialogContent>
    </Dialog>
  );
};
