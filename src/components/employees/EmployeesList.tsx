
import React, { useState } from "react";
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: string;
  targetCompletion: number;
  targets: {
    id: number;
    description: string;
    deadline: string;
    progress: number;
  }[];
}

export const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTargets, setShowTargets] = useState<number | null>(null);
  
  // Sample data for employees
  const employees: Employee[] = [
    {
      id: 1,
      name: "John Smith",
      position: "Head Chef",
      department: "Kitchen",
      status: "Active",
      targetCompletion: 85,
      targets: [
        {
          id: 101,
          description: "Reduce food waste by 15%",
          deadline: "2023-12-31",
          progress: 70
        },
        {
          id: 102,
          description: "Train 3 new kitchen staff",
          deadline: "2023-11-15",
          progress: 100
        },
      ]
    },
    {
      id: 2,
      name: "Mary Johnson",
      position: "Floor Manager",
      department: "Service",
      status: "Active",
      targetCompletion: 92,
      targets: [
        {
          id: 201,
          description: "Improve customer satisfaction to 4.8/5",
          deadline: "2023-12-15",
          progress: 90
        },
        {
          id: 202,
          description: "Reduce wait times by 10%",
          deadline: "2023-10-31",
          progress: 95
        },
      ]
    },
    {
      id: 3,
      name: "Robert Wilson",
      position: "Waiter",
      department: "Service",
      status: "On Leave",
      targetCompletion: 60,
      targets: [
        {
          id: 301,
          description: "Upsell premium dishes to 20% of tables",
          deadline: "2023-11-30",
          progress: 60
        },
      ]
    },
    {
      id: 4,
      name: "Susan Brown",
      position: "Sous Chef",
      department: "Kitchen",
      status: "Active",
      targetCompletion: 78,
      targets: [
        {
          id: 401,
          description: "Develop 5 new menu items",
          deadline: "2023-12-31",
          progress: 80
        },
        {
          id: 402,
          description: "Implement new inventory tracking system",
          deadline: "2023-11-15",
          progress: 75
        },
      ]
    },
    {
      id: 5,
      name: "Michael Davis",
      position: "Bartender",
      department: "Bar",
      status: "Active",
      targetCompletion: 88,
      targets: [
        {
          id: 501,
          description: "Create 3 new signature cocktails",
          deadline: "2023-10-31",
          progress: 100
        },
        {
          id: 502,
          description: "Reduce bar inventory costs by 10%",
          deadline: "2023-12-15",
          progress: 75
        },
      ]
    },
  ];

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTargets = (id: number) => {
    if (showTargets === id) {
      setShowTargets(null);
    } else {
      setShowTargets(id);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus size={16} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
            {filteredEmployees.map(employee => (
              <React.Fragment key={employee.id}>
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
                {showTargets === employee.id && (
                  <tr>
                    <td colSpan={6} className="py-4 bg-gray-800">
                      <div className="px-4 py-3">
                        <h4 className="font-medium mb-3 text-green-400">Employee Targets</h4>
                        <div className="space-y-4">
                          {employee.targets.map(target => (
                            <div key={target.id} className="bg-gray-700 p-3 rounded-lg">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">{target.description}</span>
                                <span className="text-gray-400">Deadline: {target.deadline}</span>
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
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
