
import React, { useState } from "react";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderSearchBar } from "@/components/orders/OrderSearchBar";
import { NewOrderDialog } from "@/components/orders/NewOrderDialog";
import { OrdersHeader } from "./OrdersHeader";
import { useOrders, OrderForm, OrderItem } from "@/hooks/useOrders";

export const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<OrderForm>({
    customerName: "",
    tableNumber: "",
    status: "pending",
    paymentStatus: "pending"
  });
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  
  const { orders, loading, createOrder } = useOrders();

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewOrderDialog = () => {
    setNewOrder({
      customerName: "",
      tableNumber: "",
      status: "pending",
      paymentStatus: "pending"
    });
    setSelectedItems([]);
    setShowNewOrderDialog(true);
  };

  const handleAddOrder = async () => {
    const success = await createOrder(newOrder, selectedItems);
    if (success) {
      setShowNewOrderDialog(false);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <OrdersHeader onNewOrder={handleOpenNewOrderDialog} />

      <OrderSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <OrderTable 
        orders={filteredOrders} 
        loading={loading}
      />

      <NewOrderDialog 
        open={showNewOrderDialog} 
        onOpenChange={setShowNewOrderDialog}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
};

