
import React from "react";

export const POSTopBar = () => {
  return (
    <div className="bg-gray-100 p-2 border-b border-gray-200">
      <div className="flex space-x-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          New
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Orders
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Hold
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Table
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Request
        </button>
      </div>
    </div>
  );
};
