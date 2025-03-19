
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReportData } from "@/hooks/useReports";

interface OrderExportButtonProps {
  reportData: ReportData | null;
  onExportReport: (format: string) => void;
  loading: boolean;
}

export const OrderExportButton: React.FC<OrderExportButtonProps> = ({
  reportData, 
  onExportReport,
  loading
}) => {
  return (
    <Button
      variant="outline"
      onClick={() => onExportReport('csv')}
      disabled={loading || !reportData}
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4" />
      <span>Export CSV</span>
    </Button>
  );
};
