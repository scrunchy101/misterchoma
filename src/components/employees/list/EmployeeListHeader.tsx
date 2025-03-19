
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeListHeaderProps {
  onAddEmployee: () => void;
}

export const EmployeeListHeader = ({ onAddEmployee }: EmployeeListHeaderProps) => {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-xl font-semibold">Employees</h2>
      <Button 
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={onAddEmployee}
      >
        <Plus size={16} className="mr-2" />
        Add Employee
      </Button>
    </div>
  );
};
