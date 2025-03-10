
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, CheckCircle, PenBox } from "lucide-react";
import { usePOSContext } from "../POSContext";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const { cartTotal, formatCurrency, processOrder } = usePOSContext();
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [notes, setNotes] = React.useState("");

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: "Walk-in Customer",
      tableNumber: null,
      paymentMethod: paymentMethod
    });

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="payment">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </div>
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">
              <div className="flex items-center gap-2">
                <PenBox className="h-4 w-4" />
                Order Notes
              </div>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center font-medium">
            <span>Total Amount:</span>
            <span className="text-lg">{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleCheckout} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
