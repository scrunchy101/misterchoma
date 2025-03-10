
import React, { useState } from "react";
import { Trash, Minus, Plus, CheckCircle, User, Hash, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePOSContext } from "@/components/pos/POSContext";

export const POSCart = () => {
  const { cartItems, updateItemQuantity, removeItemFromCart, clearCart, cartTotal, processOrder, isProcessingOrder } = usePOSContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: customerName || "Walk-in Customer",
      tableNumber: tableNumber ? Number(tableNumber) : null,
      paymentMethod: paymentMethod
    });
    
    if (success) {
      setIsCheckoutOpen(false);
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod("cash");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Current Order</h2>
      
      {cartItems.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-gray-800 p-3 mb-3 border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      className="p-1 rounded-full hover:bg-gray-700"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-700"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    className="ml-2 p-1 rounded-full hover:bg-gray-700 text-red-400"
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="border-t border-gray-600 pt-4 mt-auto">
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mb-4">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button 
                variant="outline" 
                className="border-gray-600 hover:bg-gray-600"
                onClick={clearCart}
              >
                Clear
              </Button>
              
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">Checkout</Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Complete Order</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Fill in the order details to complete checkout.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        <label htmlFor="customer">Customer Name (optional)</label>
                      </div>
                      <Input 
                        id="customer"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Walk-in Customer"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Hash size={16} className="mr-2 text-gray-400" />
                        <label htmlFor="table">Table Number (optional)</label>
                      </div>
                      <Input 
                        id="table"
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Table Number"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CreditCard size={16} className="mr-2 text-gray-400" />
                        <label htmlFor="payment">Payment Method</label>
                      </div>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                          <SelectItem value="debit">Debit Card</SelectItem>
                          <SelectItem value="mobile">Mobile Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="border-gray-600 hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCheckout}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isProcessingOrder}
                    >
                      {isProcessingOrder ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Complete Order
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="mb-4 p-4 rounded-full bg-gray-800">
            <ShoppingCart size={48} className="opacity-50" />
          </div>
          <p className="mb-2">Your cart is empty</p>
          <p className="text-sm text-center">Add items from the menu to create an order</p>
        </div>
      )}
    </div>
  );
};

// Shopping Cart Icon Component
const ShoppingCart = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);
