
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportData, ReportType } from '@/hooks/useReports';
import { format } from 'date-fns';

// Function to generate CSV content from report data
export const generateCSVReport = (reportData: ReportData, reportType: ReportType): string => {
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
  
  return csvContent;
};

// Function to generate PDF report with insights
export const generatePDFReport = (reportData: ReportData, reportType: ReportType): jsPDF => {
  const doc = new jsPDF();
  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
  const date = format(new Date(), 'MMMM dd, yyyy');
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${date}`, 105, 30, { align: 'center' });
  
  // Add description/insights based on report type
  doc.setFontSize(14);
  doc.text('Report Insights:', 20, 45);
  doc.setFontSize(11);
  
  let yPos = 55;
  const insights = generateInsights(reportData, reportType);
  
  insights.forEach(insight => {
    const splitText = doc.splitTextToSize(insight, 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 7;
  });
  
  // Add data table
  yPos += 10;
  const tableData = reportData.labels.map((label, index) => {
    const row = [label];
    reportData.datasets.forEach(dataset => {
      row.push(dataset.data[index].toString());
    });
    return row;
  });
  
  const headers = ['Category', ...reportData.datasets.map(ds => ds.name)];
  
  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: tableData
  });
  
  // Add summary if available
  if (reportData.summary) {
    const summaryY = doc.lastAutoTable?.finalY || yPos + 50;
    doc.setFontSize(14);
    doc.text('Summary:', 20, summaryY + 10);
    
    autoTable(doc, {
      startY: summaryY + 15,
      head: [['Metric', 'Value']],
      body: [
        ['Total', reportData.summary.total.toFixed(2)],
        ['Average', reportData.summary.average.toFixed(2)],
        ['Highest', reportData.summary.highest.toFixed(2)],
        ['Lowest', reportData.summary.lowest.toFixed(2)]
      ]
    });
  }
  
  return doc;
};

// Function to generate insights based on the report data
const generateInsights = (reportData: ReportData, reportType: ReportType): string[] => {
  const insights: string[] = [];
  
  if (!reportData || !reportData.datasets || reportData.datasets.length === 0 || reportData.labels.length === 0) {
    return ['No data available for analysis.'];
  }
  
  const dataset = reportData.datasets[0];
  const data = dataset.data;
  
  // Basic insights
  const sum = data.reduce((a, b) => a + b, 0);
  const avg = sum / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const maxIndex = data.indexOf(max);
  const minIndex = data.indexOf(min);
  
  switch (reportType) {
    case 'sales':
      insights.push(`Total sales for the selected period were TZS ${sum.toLocaleString()}.`);
      insights.push(`Average daily sales were TZS ${avg.toLocaleString()}.`);
      insights.push(`The highest sales of TZS ${max.toLocaleString()} were recorded on ${reportData.labels[maxIndex]}.`);
      insights.push(`The lowest sales of TZS ${min.toLocaleString()} were recorded on ${reportData.labels[minIndex]}.`);
      
      // Trend analysis
      if (data.length > 1) {
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const percentChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
        
        if (percentChange > 0) {
          insights.push(`Sales are trending upward with a ${percentChange.toFixed(1)}% increase in the latter half of the period.`);
        } else if (percentChange < 0) {
          insights.push(`Sales are trending downward with a ${Math.abs(percentChange).toFixed(1)}% decrease in the latter half of the period.`);
        } else {
          insights.push('Sales have remained stable throughout the period.');
        }
      }
      break;
    
    case 'inventory':
      insights.push(`There are ${data.length} different categories in your inventory.`);
      insights.push(`The category with the most items is ${reportData.labels[maxIndex]} with ${max} items.`);
      insights.push(`The category with the fewest items is ${reportData.labels[minIndex]} with ${min} items.`);
      break;
    
    case 'menu':
      insights.push(`Your top selling menu item is ${reportData.labels[maxIndex]} with ${max} orders.`);
      insights.push(`The least popular item is ${reportData.labels[minIndex]} with only ${min} orders.`);
      insights.push(`On average, each menu item receives about ${avg.toFixed(0)} orders.`);
      break;
    
    case 'orders':
      const topStatus = reportData.labels[maxIndex];
      insights.push(`The most common order status is "${topStatus}" with ${max} orders.`);
      insights.push(`The least common order status is "${reportData.labels[minIndex]}" with ${min} orders.`);
      
      if (reportData.labels.includes('completed') && reportData.labels.includes('pending')) {
        const completedIndex = reportData.labels.indexOf('completed');
        const pendingIndex = reportData.labels.indexOf('pending');
        const completedCount = data[completedIndex];
        const pendingCount = data[pendingIndex];
        
        const completionRate = (completedCount / (completedCount + pendingCount)) * 100;
        insights.push(`Your order completion rate is ${completionRate.toFixed(1)}%.`);
      }
      break;
    
    default:
      insights.push(`This report contains ${data.length} data points.`);
      insights.push(`The highest value is ${max} and the lowest value is ${min}.`);
  }
  
  return insights;
};
