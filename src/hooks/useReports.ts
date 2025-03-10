
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export type ReportType = 'sales' | 'inventory' | 'employee' | 'menu';
export type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export interface ReportData {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
  summary?: {
    total: number;
    average: number;
    highest: number;
    lowest: number;
  };
}

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const fetchSalesReport = async (
    timeRange: TimeRange,
    startDate?: Date,
    endDate?: Date
  ): Promise<ReportData | null> => {
    try {
      setLoading(true);
      
      // Determine date range based on timeRange
      let start: Date;
      let end: Date = endOfDay(new Date());
      
      switch (timeRange) {
        case 'today':
          start = startOfDay(new Date());
          break;
        case 'yesterday':
          start = startOfDay(subDays(new Date(), 1));
          end = endOfDay(subDays(new Date(), 1));
          break;
        case 'week':
          start = startOfDay(subDays(new Date(), 7));
          break;
        case 'month':
          start = startOfDay(subDays(new Date(), 30));
          break;
        case 'custom':
          if (!startDate || !endDate) {
            throw new Error('Custom date range requires both start and end dates');
          }
          start = startOfDay(startDate);
          end = endOfDay(endDate);
          break;
        default:
          start = startOfDay(subDays(new Date(), 7));
      }
      
      // Fetch orders within the date range
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, created_at, total_amount, payment_status')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');
      
      if (error) throw error;
      
      // Format data for the chart
      const completedOrders = orders.filter(order => order.payment_status === 'completed');
      const dailySales: Record<string, number> = {};
      
      // Group by date
      completedOrders.forEach(order => {
        const date = format(new Date(order.created_at), 'yyyy-MM-dd');
        dailySales[date] = (dailySales[date] || 0) + (order.total_amount || 0);
      });
      
      const labels = Object.keys(dailySales).sort();
      const salesData = labels.map(date => dailySales[date]);
      
      // Calculate summary
      const total = salesData.reduce((sum, value) => sum + value, 0);
      const average = salesData.length > 0 ? total / salesData.length : 0;
      const highest = Math.max(...(salesData.length > 0 ? salesData : [0]));
      const lowest = Math.min(...(salesData.length > 0 ? salesData : [0]));
      
      const reportData: ReportData = {
        labels: labels.map(date => format(new Date(date), 'MMM dd')),
        datasets: [{
          name: 'Sales',
          data: salesData
        }],
        summary: {
          total,
          average,
          highest,
          lowest
        }
      };
      
      setReportData(reportData);
      return reportData;
    } catch (error) {
      handleError(error, {
        showToast: true,
        severity: "error",
        context: "Fetching sales report"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInventoryReport = async (): Promise<ReportData | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('category');
      
      if (error) throw error;
      
      // Group by category
      const categoryCounts: Record<string, number> = {};
      data.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      });
      
      const labels = Object.keys(categoryCounts);
      const inventoryCounts = labels.map(category => categoryCounts[category]);
      
      const reportData: ReportData = {
        labels,
        datasets: [{
          name: 'Item Count',
          data: inventoryCounts
        }]
      };
      
      setReportData(reportData);
      return reportData;
    } catch (error) {
      handleError(error, {
        showToast: true,
        severity: "error",
        context: "Fetching inventory report"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMenuPerformanceReport = async (): Promise<ReportData | null> => {
    try {
      setLoading(true);
      
      // Get order items with menu items
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          menu_items (
            id, 
            name,
            category
          )
        `)
        .order('menu_item_id');
      
      if (error) throw error;
      
      // Count item occurrences
      const itemCounts: Record<string, number> = {};
      data.forEach(item => {
        const name = item.menu_items?.name || 'Unknown';
        itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
      });
      
      const sortedItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 items
      
      const reportData: ReportData = {
        labels: sortedItems.map(([name]) => name),
        datasets: [{
          name: 'Orders',
          data: sortedItems.map(([_, count]) => count)
        }]
      };
      
      setReportData(reportData);
      return reportData;
    } catch (error) {
      handleError(error, {
        showToast: true,
        severity: "error",
        context: "Fetching menu performance report"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const generateReport = async (
    reportType: ReportType,
    timeRange: TimeRange = 'week',
    startDate?: Date,
    endDate?: Date
  ): Promise<ReportData | null> => {
    try {
      switch (reportType) {
        case 'sales':
          return fetchSalesReport(timeRange, startDate, endDate);
        case 'inventory':
          return fetchInventoryReport();
        case 'menu':
          return fetchMenuPerformanceReport();
        default:
          toast({
            title: "Report not available",
            description: "The requested report type is not implemented yet.",
            variant: "destructive"
          });
          return null;
      }
    } catch (error) {
      handleError(error, {
        showToast: true,
        severity: "error",
        context: "Generating report"
      });
      return null;
    }
  };
  
  return {
    loading,
    reportData,
    generateReport
  };
};
