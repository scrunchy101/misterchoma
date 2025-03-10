
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReceiptViewer } from "@/components/billing/ReceiptViewer";
import { TransactionData } from "@/components/billing/receiptUtils";
import { TransactionSearch } from "./transaction/TransactionSearch";
import { TransactionTable } from "./transaction/TransactionTable";
import { TransactionPagination } from "./transaction/TransactionPagination";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionItems } from "@/hooks/useTransactionItems";

export const RecentTransactions = () => {
  const { toast } = useToast();
  const [receiptData, setReceiptData] = useState<TransactionData | null>(null);
  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  
  // Fetch transactions data
  const { data: transactions = [], isLoading } = useTransactions(searchQuery);
  
  // Fetch items for selected transaction
  const { data: transactionItems = [] } = useTransactionItems(selectedTransactionId);
  
  const itemsPerPage = 5;

  const handleViewReceipt = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (transaction) {
      setSelectedTransactionId(transactionId);
      
      setReceiptData({
        id: transaction.id,
        date: transaction.date,
        customer: transaction.customer,
        paymentMethod: transaction.paymentMethod,
        total: transaction.amount,
        items: transactionItems
      });
      
      setIsReceiptViewerOpen(true);
    }
  };

  const handleViewDetails = (transactionId: string) => {
    toast({
      title: "View Details",
      description: `Details for transaction ${transactionId}`
    });
    // This would typically navigate to a transaction details page or open a modal
  };

  const handleProcessPayment = (transactionId: string) => {
    toast({
      title: "Process Payment",
      description: `Payment processing for transaction ${transactionId}`
    });
    // This would typically open a payment processing dialog/modal
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const totalItems = transactions.length;
  
  // Calculate pagination
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Recent Transactions</h3>
        <TransactionSearch onSearch={handleSearch} />
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <>
          <TransactionTable 
            transactions={paginatedTransactions} 
            onViewReceipt={handleViewReceipt}
            onViewDetails={handleViewDetails}
            onProcessPayment={handleProcessPayment}
          />
          
          <TransactionPagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ReceiptViewer 
        isOpen={isReceiptViewerOpen}
        onClose={() => setIsReceiptViewerOpen(false)}
        transactionData={receiptData}
      />
    </div>
  );
};
