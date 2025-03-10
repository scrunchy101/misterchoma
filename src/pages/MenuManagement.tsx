
import { MenuManagementPage } from "@/components/menu/MenuManagementPage";
import { populateMisterChomaMenu } from "@/components/menu/menuUtils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const MenuManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePopulateMenu = async () => {
    if (!confirm("This will replace all existing menu items with the Mister Choma menu. Are you sure?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await populateMisterChomaMenu();
      toast({
        title: "Menu Updated",
        description: `Successfully added ${result.count} Mister Choma menu items.`,
      });
      // Force page reload to show new menu
      window.location.reload();
    } catch (error) {
      console.error("Error populating menu:", error);
      toast({
        title: "Error",
        description: "Failed to populate the menu. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-4 bg-gray-800 border-b border-gray-700">
        <Button 
          onClick={handlePopulateMenu} 
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
        >
          {isLoading ? "Loading..." : "Load Mister Choma Menu"}
        </Button>
      </div>
      <div className="flex-1">
        <MenuManagementPage />
      </div>
    </div>
  );
};

export default MenuManagement;
