
import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { EmployeeTargets } from "./EmployeeTargets";
import { EmployeeTableRow } from "./EmployeeTableRow";
import { Employee } from "../types";

interface EmployeeTableProps {
  filteredEmployees: Employee[];
  showTargets: string | null;
  toggleTargets: (id: string) => void;
  loading: boolean;
}

export const EmployeeTable = ({ 
  filteredEmployees, 
  showTargets, 
  toggleTargets, 
  loading 
}: EmployeeTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-600">
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium">Position</th>
            <th className="pb-3 font-medium">Department</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Target Completion</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <React.Fragment key={employee.id}>
                <EmployeeTableRow 
                  employee={employee} 
                  toggleTargets={toggleTargets} 
                />
                {showTargets === employee.id && (
                  <EmployeeTargets employee={employee} />
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-400">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
