
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderMenuItems } from "@/components/orders/OrderMenuItems";
import { OrderItemsList } from "@/components/orders/OrderItemsList";
import { OrderDetailsForm } from "@/components/orders/OrderDetailsForm";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOrder: () => void;
  isSubmitting?: boolean;
}

export const NewOrderDialog = ({ 
  open, 
  onOpenChange, 
  onAddOrder, 
  isSubmitting 
}: NewOrderDialogProps) => {
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    tableNumber: "",
    status: "pending",
    paymentStatus: "pending"
  });
  const [selectedTab, setSelectedTab] = useState<"details" | "menu">("details");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [showMenuFirst, setShowMenuFirst] = useState(false);
  const { toast } = useToast();

  // Effect to switch to menu tab initially when opened
  useEffect(() => {
    if (open && showMenuFirst) {
      setSelectedTab("menu");
    }
  }, [open, showMenuFirst]);

  // When dialog opens, check if cart is empty and show menu first
  useEffect(() => {
    if (open) {
      setShowMenuFirst(selectedItems.length === 0);
    }
  }, [open, selectedItems.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleAddMenuItem = (itemId: string, itemName: string, itemPrice: number) => {
    const existingItemIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { id: itemId, name: itemName, price: itemPrice, quantity: 1 }]);
    }

    toast({
      title: "Item added",
      description: `Added ${itemName} to the order`,
    });
  };

  const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedItems(selectedItems.filter(item => item.id !== itemId));
      return;
    }
    
    const updatedItems = selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setSelectedItems(updatedItems);
  };

  const calculateOrderTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the order",
        variant: "destructive"
      });
      setSelectedTab("menu");
      return;
    }
    
    await onAddOrder();
    
    setNewOrder({
      customerName: "",
      tableNumber: "",
      status: "pending",
      paymentStatus: "pending"
    });
    setSelectedItems([]);
    setSelectedTab("details");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add order details and menu items.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "details" | "menu")}>
          <TabsList className="bg-gray-700 mb-4">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-2">
            <OrderDetailsForm 
              newOrder={newOrder}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              hasItems={selectedItems.length > 0}
              onAddMenuItems={() => setSelectedTab("menu")}
            />
          </TabsContent>
          
          <TabsContent value="menu" className="py-2">
            <OrderMenuItems onSelectItem={handleAddMenuItem} />
          </TabsContent>
        </Tabs>

        <OrderItemsList 
          items={selectedItems} 
          onUpdateQuantity={handleUpdateItemQuantity} 
          calculateTotal={calculateOrderTotal} 
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting || selectedItems.length === 0}
          >
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
