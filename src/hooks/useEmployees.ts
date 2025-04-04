
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Employee {
  id: string;
  name: string;
  position: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('employees')
        .select('id, name, position')
        .eq('status', 'active')
        .order('name');

      if (supabaseError) throw supabaseError;
      
      setEmployees(data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
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
  }, []);

  return { employees, loading, fetchEmployees, error };
};
