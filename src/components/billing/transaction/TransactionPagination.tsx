
import React from "react";
import { Button } from "@/components/ui/button";

interface TransactionPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="p-4 border-t border-gray-100 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Showing {Math.min(itemsPerPage, totalItems)} of {totalItems} transactions
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
