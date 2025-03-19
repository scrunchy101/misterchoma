
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "../types";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
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

  return { employees, loading, fetchEmployees };
};
