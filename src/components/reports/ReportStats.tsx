
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportData } from "@/hooks/useReports";

interface ReportStatsProps {
  data: ReportData | null;
  loading?: boolean;
  formatValue?: (value: number) => string;
}

export const ReportStats: React.FC<ReportStatsProps> = ({ 
  data,
  loading = false,
  formatValue = (value) => value.toLocaleString()
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-700 border-gray-600">
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-gray-600 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="p-6">
            <p className="text-gray-400">No summary data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { total, average, highest, lowest } = data.summary;

  const stats = [
    {
      title: "Total",
      value: formatValue(total)
    },
    {
      title: "Average",
      value: formatValue(average)
    },
    {
      title: "Highest",
      value: formatValue(highest)
    },
    {
      title: "Lowest",
      value: formatValue(lowest)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-700 border-gray-600">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
