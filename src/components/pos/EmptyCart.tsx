
import React from "react";

export const EmptyCart = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <div className="mb-4 p-4 rounded-full bg-gray-800">
        <ShoppingCart size={48} className="opacity-50" />
      </div>
      <p className="mb-2">Your cart is empty</p>
      <p className="text-sm text-center">Add items from the menu to create an order</p>
    </div>
  );
};

// Shopping Cart Icon Component
const ShoppingCart = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
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
