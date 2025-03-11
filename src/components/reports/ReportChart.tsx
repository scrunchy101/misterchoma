
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart,
  Line
} from "recharts";
import { ReportData } from "@/hooks/useReports";

interface ReportChartProps {
  data: ReportData | null;
  title: string;
  type?: "bar" | "line";
  loading?: boolean;
}

export const ReportChart: React.FC<ReportChartProps> = ({ 
  data, 
  title, 
  type = "bar",
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-gray-700 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach(dataset => {
      dataPoint[dataset.name] = dataset.data[index];
    });
    return dataPoint;
  });

  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "0.5rem"
                }} 
              />
              {data.datasets.map((dataset, index) => (
                <Bar 
                  key={dataset.name} 
                  dataKey={dataset.name} 
                  fill={colors[index % colors.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "0.5rem"
                }} 
              />
              {data.datasets.map((dataset, index) => (
                <Line
                  key={dataset.name}
                  type="monotone"
                  dataKey={dataset.name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
