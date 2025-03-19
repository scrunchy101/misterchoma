
import React from "react";

export const MenuLoadingState = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="animate-pulse flex space-x-4 items-center">
        <div className="h-10 bg-gray-600 rounded w-full"></div>
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4 items-center">
          <div className="h-16 bg-gray-600 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};
