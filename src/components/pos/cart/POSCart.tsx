
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash, CheckCircle, User } from "lucide-react";
import { usePOSContext } from "@/components/pos/POSContext";
import { CheckoutDialog } from "@/components/pos/checkout/CheckoutDialog";

interface POSCartProps {
  customerName: string;
  setCustomerName: (name: string) => void;
}

export const POSCart = ({ customerName, setCustomerName }: POSCartProps) => {
  const { cartItems, cartTotal, formatCurrency, removeItemFromCart, updateItemQuantity, clearCart } = usePOSContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <Card className="h-full flex flex-col bg-white p-4 border-gray-200 shadow">
      {/* Customer Information */}
      <div className="mb-4 flex items-center">
        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
          <User size={16} />
        </div>
        <Input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="flex-1 bg-gray-50 border-gray-200"
        />
      </div>
      
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto mb-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="mb-4 p-4 rounded-full bg-gray-100">
              <ShoppingCart size={48} className="opacity-50" />
            </div>
            <p className="mb-2 text-gray-500">Your cart is empty</p>
            <p className="text-sm text-center text-gray-400">Add items from the menu to create an order</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="border-b border-gray-200 py-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} className="text-gray-500" />
                  </button>
                  <span className="mx-2 text-gray-800">{item.quantity}</span>
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} className="text-gray-500" />
                  </button>
                </div>
                <button 
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 text-red-400"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Cart Summary */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal:</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>Total:</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-100 text-gray-800"
            onClick={() => clearCart()}
          >
            Clear
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600"
            disabled={cartItems.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            <CheckCircle size={16} className="mr-2" />
            Checkout
          </Button>
        </div>
      </div>

      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
      />
    </Card>
  );
};
