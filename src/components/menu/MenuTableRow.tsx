
import React from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/hooks/useMenuItems";
import { useMenu } from "./MenuContext";
import { Switch } from "@/components/ui/switch";
import { MenuEditDialog } from "./MenuEditDialog";

interface MenuTableRowProps {
  item: MenuItem;
}

export const MenuTableRow = ({ item }: MenuTableRowProps) => {
  const { toast } = useToast();
  const { refreshMenu } = useMenu();
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  const toggleAvailability = async () => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: !item.available })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `${item.name} is now ${!item.available ? 'available' : 'unavailable'}`,
      });

      await refreshMenu();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: "Error",
        description: "Failed to update item availability",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "The menu item has been removed successfully.",
      });
      
      await refreshMenu();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete the item. It might be referenced in orders.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <tr key={item.id} className="border-b border-gray-600">
        <td className="py-4 font-medium">{item.name}</td>
        <td className="py-4">{item.category}</td>
        <td className="py-4">TZS {item.price.toLocaleString()}</td>
        <td className="py-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={item.available} 
              onCheckedChange={toggleAvailability}
            />
            <span className={item.available ? "text-green-400" : "text-red-400"}>
              {item.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </td>
        <td className="py-4 max-w-xs truncate">{item.description || "—"}</td>
        <td className="py-4">
          <div className="flex space-x-2">
            <button 
              className="text-blue-400 hover:text-blue-300"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit size={18} />
            </button>
            <button 
              className="text-red-400 hover:text-red-300"
              onClick={handleDelete}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
      
      {showEditDialog && (
        <MenuEditDialog 
          item={item}
          isOpen={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
};
