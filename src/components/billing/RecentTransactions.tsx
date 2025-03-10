
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReceiptViewer } from "@/components/billing/ReceiptViewer";
import { TransactionData } from "@/components/billing/receiptUtils";
import { TransactionSearch } from "./transaction/TransactionSearch";
import { TransactionTable } from "./transaction/TransactionTable";
import { TransactionPagination } from "./transaction/TransactionPagination";
import { sampleTransactions, sampleTransactionItems } from "./transaction/transactionData";

export const RecentTransactions = () => {
  const { toast } = useToast();
  const [receiptData, setReceiptData] = useState<TransactionData | null>(null);
  const [isReceiptViewerOpen, setIsReceiptViewerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data - would come from an API in a real app
  const transactions = sampleTransactions;
  const transactionItems = sampleTransactionItems;
  const itemsPerPage = 5;

  const handleViewReceipt = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (transaction) {
      setReceiptData({
        id: transaction.id,
        date: transaction.date,
        customer: transaction.customer,
        paymentMethod: transaction.paymentMethod,
        total: transaction.amount,
        items: transactionItems[transactionId] || []
      });
      setIsReceiptViewerOpen(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredTransactions.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Recent Transactions</h3>
        <TransactionSearch onSearch={handleSearch} />
      </div>
      
      <TransactionTable 
        transactions={filteredTransactions.slice(0, itemsPerPage)} 
        onViewReceipt={handleViewReceipt} 
      />
      
      <TransactionPagination 
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <ReceiptViewer 
        isOpen={isReceiptViewerOpen}
        onClose={() => setIsReceiptViewerOpen(false)}
        transactionData={receiptData}
      />
    </div>
  );
};
