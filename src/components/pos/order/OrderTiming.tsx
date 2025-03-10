
import React from "react";

export const OrderTiming = () => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <button className="bg-red-500 text-white py-2 rounded">
        Now
      </button>
      <button className="bg-gray-200 text-gray-800 py-2 rounded">
        Schedule for later
      </button>
    </div>
  );
};
