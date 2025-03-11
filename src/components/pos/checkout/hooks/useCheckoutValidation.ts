
import { useState } from "react";

interface ValidationErrors {
  customerName?: string;
  tableNumber?: string;
  paymentMethod?: string;
}

export const useCheckoutValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateCheckoutForm = ({
    customerName,
    tableNumber,
    paymentMethod,
  }: {
    customerName: string;
    tableNumber: string | null;
    paymentMethod: string;
  }) => {
    const newErrors: ValidationErrors = {};

    // Validate table number if provided
    if (tableNumber && !/^\d+$/.test(tableNumber)) {
      newErrors.tableNumber = "Table number must be a valid number";
    }

    // Validate payment method
    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    // Customer name validation (optional)
    if (customerName && customerName.length > 50) {
      newErrors.customerName = "Customer name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    validateCheckoutForm,
    clearErrors: () => setErrors({}),
  };
};
