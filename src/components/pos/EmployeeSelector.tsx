
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";
import { User } from "lucide-react";

interface EmployeeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { employees, loading } = useEmployees();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1 flex items-center">
        <User size={16} className="mr-1" />
        Employee Serving
      </label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          {loading ? (
            <SelectItem value="loading" disabled>Loading employees...</SelectItem>
          ) : employees.length === 0 ? (
            <SelectItem value="none" disabled>No employees found</SelectItem>
          ) : (
            employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.position})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
