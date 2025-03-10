
import React from "react";
import { Employee } from "../types";

interface EmployeeTargetsProps {
  employee: Employee;
}

export const EmployeeTargets = ({ employee }: EmployeeTargetsProps) => {
  if (employee.targets.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-4 bg-gray-800">
          <div className="px-4 py-3 text-center text-gray-400">
            No targets found for this employee
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={6} className="py-4 bg-gray-800">
        <div className="px-4 py-3">
          <h4 className="font-medium mb-3 text-green-400">Employee Targets</h4>
          <div className="space-y-4">
            {employee.targets.map(target => (
              <div key={target.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{target.target_name}</span>
                  <span className="text-gray-400">Deadline: {new Date(target.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-600 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        target.progress >= 90 ? 'bg-green-600' : 
                        target.progress >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${target.progress}%` }}
                    />
                  </div>
                  <span className="min-w-[40px]">{target.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
};
