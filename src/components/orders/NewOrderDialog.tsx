
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderMenuItems } from "@/components/orders/OrderMenuItems";
import { OrderItemsList } from "@/components/orders/OrderItemsList";
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
  onAddOrder: () => Promise<void>;
}

export const NewOrderDialog = ({ 
  open, 
  onOpenChange, 
  onAddOrder 
}: NewOrderDialogProps) => {
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    tableNumber: "",
    status: "pending",
    paymentStatus: "pending"
  });
  const [selectedTab, setSelectedTab] = useState<"details" | "menu">("details");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

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
    // Check if the item already exists in the selected items
    const existingItemIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item if it doesn't exist
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
      return;
    }
    
    await onAddOrder();
    
    // Reset form after submission
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
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (optional)</Label>
              <Input
                id="customerName"
                name="customerName"
                value={newOrder.customerName}
                onChange={handleInputChange}
                placeholder="Customer Name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number (optional)</Label>
              <Input
                id="tableNumber"
                name="tableNumber"
                type="number"
                value={newOrder.tableNumber}
                onChange={handleInputChange}
                placeholder="Table Number"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select
                value={newOrder.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={newOrder.paymentStatus}
                onValueChange={(value) => handleSelectChange("paymentStatus", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            disabled={selectedItems.length === 0}
          >
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
