
import React from "react";
import { Users, Target, Award, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const EmployeeStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["employeeStats"],
    queryFn: async () => {
      // Fetch all employees
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, status');
      
      if (employeesError) throw employeesError;

      // Fetch all targets
      const { data: targets, error: targetsError } = await supabase
        .from('employee_targets')
        .select('*');
      
      if (targetsError) throw targetsError;

      // Calculate stats
      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(emp => emp.status === 'Active').length || 0;
      const totalTargets = targets?.length || 0;
      
      // Calculate average target completion
      const completionRates = targets?.map(target => 
        (target.current_value / target.target_value) * 100
      ) || [];
      const avgCompletion = completionRates.length > 0 
        ? Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length) 
        : 0;

      // Count top performers (employees with >80% target completion)
      const employeePerformance = new Map();
      targets?.forEach(target => {
        const completion = (target.current_value / target.target_value) * 100;
        if (!employeePerformance.has(target.employee_id)) {
          employeePerformance.set(target.employee_id, []);
        }
        employeePerformance.get(target.employee_id).push(completion);
      });

      let topPerformers = 0;
      employeePerformance.forEach(completions => {
        const avgEmployeeCompletion = completions.reduce((a, b) => a + b, 0) / completions.length;
        if (avgEmployeeCompletion >= 80) topPerformers++;
      });

      return {
        totalEmployees,
        activeTargets: totalTargets,
        avgCompletion,
        topPerformers
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-700 rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-20 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: String(stats?.totalEmployees || 0),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Targets",
      value: String(stats?.activeTargets || 0),
      icon: Target,
      color: "bg-purple-500",
    },
    {
      title: "Target Completion",
      value: `${stats?.avgCompletion || 0}%`,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Top Performers",
      value: String(stats?.topPerformers || 0),
      icon: Award,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} text-white mr-3`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
