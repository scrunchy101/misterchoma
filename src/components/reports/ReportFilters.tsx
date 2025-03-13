
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ReportType, TimeRange, ReportData } from "@/hooks/useReports";
import { OrderExportButton } from "./OrderExportButton";

interface ReportFiltersProps {
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  onGenerateReport: () => void;
  onExportReport: (format: string) => void;
  loading?: boolean;
  reportData: ReportData | null;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  setReportType,
  timeRange,
  setTimeRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerateReport,
  onExportReport,
  loading = false,
  reportData
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as ReportType)}
              disabled={loading}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="menu">Menu Performance</SelectItem>
                <SelectItem value="employee">Employee Performance</SelectItem>
                <SelectItem value="orders">Order History</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time-range">Time Range</Label>
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as TimeRange)}
              disabled={loading || (reportType !== "sales" && reportType !== "orders")}
            >
              <SelectTrigger id="time-range">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeRange === "custom" && (
            <>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div className="flex items-end gap-2">
            <Button 
              onClick={onGenerateReport} 
              className="flex-1"
              disabled={loading || (timeRange === "custom" && (!startDate || !endDate))}
            >
              {loading ? "Loading..." : "Generate Report"}
            </Button>
            <OrderExportButton 
              reportData={reportData} 
              onExportReport={onExportReport} 
              loading={loading} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
