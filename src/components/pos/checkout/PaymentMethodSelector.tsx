
import React from "react";
import { CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod
}: PaymentMethodSelectorProps) => {
  return (
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
  );
};
