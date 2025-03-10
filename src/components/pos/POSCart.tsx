
import React, { useState } from "react";
import { Trash2, Plus, Minus, CreditCard, Receipt, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePOSContext } from "@/components/pos/POSContext";

export const POSCart = () => {
  const { cartItems, updateItemQuantity, removeItemFromCart, clearCart, cartTotal } = usePOSContext();
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateItemQuantity(id, newQuantity);
      } else {
        removeItemFromCart(id);
      }
    }
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot submit an empty order",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Create new order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerName || null,
            table_number: tableNumber ? parseInt(tableNumber) : null,
            total_amount: cartTotal,
            status: 'pending',
            payment_status: 'paid',
            payment_method: paymentMethod
          }
        ])
        .select();

      if (orderError) throw orderError;
      
      if (!orderData || orderData.length === 0) {
        throw new Error('Failed to create order');
      }

      const orderId = orderData[0].id;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update the order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast({
        title: "Order Completed",
        description: `Order #${orderId.substring(0, 8).toUpperCase()} has been submitted successfully`,
      });

      // Reset the form
      clearCart();
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod(null);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Current Order</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Customer Name (Optional)</label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter customer name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Table Number (Optional)</label>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter table number"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4">
        {cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-gray-400 text-sm">${item.price.toFixed(2)} each</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-gray-700"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Minus size={14} />
                  </Button>
                  
                  <span className="w-6 text-center">{item.quantity}</span>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-gray-700"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Plus size={14} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950 ml-2"
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Receipt size={40} className="mb-2 opacity-50" />
            <p>No items in the order</p>
            <p className="text-sm">Add items from the menu</p>
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={paymentMethod === 'cash' ? 'default' : 'outline'} 
                className={`flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 hover:bg-gray-700'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <span className="mr-2">💵</span>
                Cash
              </Button>
              <Button 
                variant={paymentMethod === 'card' ? 'default' : 'outline'} 
                className={`flex items-center justify-center ${paymentMethod === 'card' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 hover:bg-gray-700'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={16} className="mr-2" />
                Card
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-4 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700"
              onClick={clearCart}
              disabled={isProcessing}
            >
              <X size={16} className="mr-2" />
              Clear Order
            </Button>
            
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmitOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                  Processing...
                </div>
              ) : (
                <>
                  <Receipt size={16} className="mr-2" />
                  Complete Order
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
