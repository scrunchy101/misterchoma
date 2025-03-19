
import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Employee } from "../types";

interface EmployeeTableRowProps {
  employee: Employee;
  toggleTargets: (id: string) => void;
}

export const EmployeeTableRow = ({ employee, toggleTargets }: EmployeeTableRowProps) => {
  return (
    <tr className="border-b border-gray-600">
      <td className="py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold mr-2">
            {employee.name.charAt(0)}
          </div>
          <span>{employee.name}</span>
        </div>
      </td>
      <td className="py-4">{employee.position}</td>
      <td className="py-4">{employee.department}</td>
      <td className="py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          employee.status === 'Active' 
            ? 'bg-green-900 text-green-300' 
            : 'bg-yellow-900 text-yellow-300'
        }`}>
          {employee.status}
        </span>
      </td>
      <td className="py-4">
        <div className="flex items-center">
          <div className="w-36 bg-gray-600 rounded-full h-2.5 mr-2">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${employee.targetCompletion}%` }}
            />
          </div>
          <span>{employee.targetCompletion}%</span>
        </div>
      </td>
      <td className="py-4">
        <div className="flex space-x-2">
          <button 
            className="text-green-400 hover:text-green-300"
            onClick={() => toggleTargets(employee.id)}
          >
            <Eye size={18} />
          </button>
          <button className="text-blue-400 hover:text-blue-300">
            <Edit size={18} />
          </button>
          <button className="text-red-400 hover:text-red-300">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
