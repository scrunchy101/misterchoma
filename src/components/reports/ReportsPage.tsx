
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ReportFilters } from "./ReportFilters";
import { ReportChart } from "./ReportChart";
import { ReportStats } from "./ReportStats";
import { useReports, ReportType, TimeRange, ReportData } from "@/hooks/useReports";

export const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { loading, reportData, generateReport } = useReports();
  const [activeTab, setActiveTab] = useState('reports');

  const formatCurrency = (value: number) => {
    return `TZS ${value.toLocaleString()}`;
  };

  const handleGenerateReport = async () => {
    await generateReport(reportType, timeRange, startDate, endDate);
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
            loading={loading}
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

