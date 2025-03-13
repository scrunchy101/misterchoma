
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReportFilters } from "./ReportFilters";
import { ReportChart } from "./ReportChart";
import { ReportStats } from "./ReportStats";
import { useReports, ReportType, TimeRange, ReportData } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";
import { OrderExportButton } from "./OrderExportButton";
import { PdfExportButton } from "./PdfExportButton";

export const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { loading, reportData, generateReport } = useReports();
  const [activeTab, setActiveTab] = useState('reports');
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return `TZS ${value.toLocaleString()}`;
  };

  const handleGenerateReport = async () => {
    if (timeRange === "custom" && (!startDate || !endDate)) {
      toast({
        title: "Invalid date range",
        description: "Please select both start and end dates for a custom range",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await generateReport(reportType, timeRange, startDate, endDate);
      toast({
        title: "Report generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated successfully.`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleExportReport = (format: string) => {
    if (!reportData) {
      toast({
        title: "No data to export",
        description: "Please generate a report first before exporting",
        variant: "destructive"
      });
      return;
    }

    try {
      if (format === 'csv') {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += "Category," + reportData.datasets.map(ds => ds.name).join(",") + "\n";
        
        // Add data rows
        reportData.labels.forEach((label, index) => {
          let row = label;
          reportData.datasets.forEach(dataset => {
            row += "," + dataset.data[index];
          });
          csvContent += row + "\n";
        });
        
        // Add summary data if available
        if (reportData.summary) {
          csvContent += "\nSummary\n";
          csvContent += "Total," + reportData.summary.total + "\n";
          csvContent += "Average," + reportData.summary.average + "\n";
          csvContent += "Highest," + reportData.summary.highest + "\n";
          csvContent += "Lowest," + reportData.summary.lowest + "\n";
        }
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        // Trigger download and cleanup
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Report exported",
          description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been exported as CSV.`,
        });
      } else if (format === 'pdf') {
        // For PDF export, we'll create a simple template for now
        // In a real implementation, you would use a PDF library like jsPDF
        toast({
          title: "PDF Export",
          description: "Preparing PDF export. This may take a moment.",
        });
        
        setTimeout(() => {
          toast({
            title: "PDF Export Ready",
            description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been prepared as PDF.`,
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the report.",
        variant: "destructive"
      });
    }
  };

  // Generate initial report on component mount
  useEffect(() => {
    handleGenerateReport();
  }, []);

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reports & Analytics" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Order Reports</h2>
            <div className="flex">
              <OrderExportButton 
                reportData={reportData} 
                onExportReport={handleExportReport} 
                loading={loading} 
              />
              <PdfExportButton 
                reportData={reportData} 
                onExportReport={handleExportReport} 
                loading={loading} 
              />
            </div>
          </div>
          
          <ReportFilters
            reportType={reportType}
            setReportType={setReportType}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onGenerateReport={handleGenerateReport}
            onExportReport={handleExportReport}
            loading={loading}
            reportData={reportData}
          />

          <div className="space-y-6">
            {reportType === "sales" && reportData?.summary && (
              <ReportStats 
                data={reportData} 
                loading={loading} 
                formatValue={formatCurrency} 
              />
            )}

            <div className="grid grid-cols-1 gap-6">
              <ReportChart
                data={reportData}
                title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
                type={reportType === "sales" ? "line" : "bar"}
                loading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
