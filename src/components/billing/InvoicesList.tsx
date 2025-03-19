
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  date: Date;
  dueDate?: Date;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

export const InvoicesList = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInvoices();
  }, []);
  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // Fetch orders to use as invoices
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Transform orders into invoice format
      const formattedInvoices: Invoice[] = (data || []).map(order => {
        const createdDate = new Date(order.created_at);
        // Due date is 14 days after creation
        const dueDate = new Date(createdDate);
        dueDate.setDate(dueDate.getDate() + 14);
        
        // Determine invoice status based on payment_status
        let status: "paid" | "pending" | "overdue" = "pending";
        if (order.payment_status === 'completed') {
          status = "paid";
        } else if (dueDate < new Date()) {
          status = "overdue";
        }
        
        return {
          id: `INV-${order.id.substring(0, 8).toUpperCase()}`,
          date: createdDate,
          dueDate: dueDate,
          customer: order.customer_name || `Table ${order.table_number || "Unknown"}`,
          amount: order.total_amount || 0,
          status: status
        };
      });
      
      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoiceId}`,
    });
  };

  const handleDownloadAll = () => {
    toast({
      title: "Download Started",
      description: "Your invoices will be downloaded shortly.",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold">Recent Invoices</h3>
      </div>
      
      {invoices.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {invoices.map(invoice => (
            <div key={invoice.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="text-sm text-gray-500">{invoice.customer}</div>
                </div>
                <Badge variant="outline" className={
                  invoice.status === "paid" ? "border-green-500 text-green-700 bg-green-50" :
                  invoice.status === "pending" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                  invoice.status === "overdue" ? "border-red-500 text-red-700 bg-red-50" :
                  ""
                }>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex justify-between mb-3">
                <div className="text-sm">
                  <div className="text-gray-500">Date:</div>
                  <div>{format(invoice.date, "MMM d, yyyy")}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">Due Date:</div>
                  <div>{invoice.dueDate ? format(invoice.dueDate, "MMM d, yyyy") : "N/A"}</div>
                </div>
                <div className="text-sm font-medium">
                  <div className="text-gray-500">Amount:</div>
                  <div>TZS {invoice.amount.toLocaleString()}</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleViewInvoice(invoice.id)}
              >
                <FileText size={14} className="mr-1" />
                View Invoice
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">No invoices found.</p>
        </div>
      )}
      
      {invoices.length > 0 && (
        <div className="p-4 border-t border-gray-100 text-center">
          <Button className="w-full" onClick={handleDownloadAll}>
            <Download size={14} className="mr-1" />
            Download All Invoices
          </Button>
        </div>
      )}
    </div>
  );
};
