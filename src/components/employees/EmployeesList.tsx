import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  targetCompletion: number;
  targets: {
    id: string;
    target_name: string;
    target_value: number;
    current_value: number;
    end_date: string;
    progress: number;
  }[];
}

export const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTargets, setShowTargets] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*');

      if (employeesError) throw employeesError;

      // Fetch targets for all employees
      const { data: targetsData, error: targetsError } = await supabase
        .from('employee_targets')
        .select('*');

      if (targetsError) throw targetsError;

      // Process the data to match the component's expected format
      const processedEmployees: Employee[] = employeesData.map(emp => {
        // Find targets for this employee
        const employeeTargets = targetsData.filter(target => target.employee_id === emp.id);
        
        // Calculate target completion percentage
        const totalTargets = employeeTargets.length;
        const completedTargetValue = employeeTargets.reduce((sum, target) => 
          sum + (target.current_value / target.target_value) * 100, 0);
        
        const averageCompletion = totalTargets > 0 
          ? Math.round(completedTargetValue / totalTargets) 
          : 0;

        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          department: emp.position.includes('Chef') ? 'Kitchen' : 
                    emp.position.includes('Manager') ? 'Management' : 
                    emp.position.includes('Waiter') || emp.position.includes('Waitress') ? 'Service' : 
                    emp.position.includes('Bartender') ? 'Bar' : 'Other',
          status: emp.status || 'Active',
          targetCompletion: averageCompletion,
          targets: employeeTargets.map(target => ({
            id: target.id,
            target_name: target.target_name,
            target_value: target.target_value,
            current_value: target.current_value,
            end_date: target.end_date,
            progress: Math.round((target.current_value / target.target_value) * 100)
          }))
        };
      });

      setEmployees(processedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [toast]);

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTargets = (id: string) => {
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
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setAddDialogOpen(true)}
        >
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

      {/* Employee add dialog */}
      <AddEmployeeDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onSuccess={fetchEmployees}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
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
                    {showTargets === employee.id && employee.targets.length > 0 && (
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
                    )}
                    {showTargets === employee.id && employee.targets.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 bg-gray-800">
                          <div className="px-4 py-3 text-center text-gray-400">
                            No targets found for this employee
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {loading ? "Loading employees..." : "No employees found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

