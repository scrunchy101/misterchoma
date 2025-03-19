
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ReportData } from "@/hooks/useReports";

interface PdfExportButtonProps {
  reportData: ReportData | null;
  onExportReport: (format: string) => void;
  loading: boolean;
}

export const PdfExportButton: React.FC<PdfExportButtonProps> = ({
  reportData, 
  onExportReport,
  loading
}) => {
  return (
    <Button
      variant="outline"
      onClick={() => onExportReport('pdf')}
      disabled={loading || !reportData}
      className="flex items-center gap-1 ml-2"
    >
      <FileText className="h-4 w-4" />
      <span>Export PDF</span>
    </Button>
  );
};
