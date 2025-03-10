
import React, { useState } from "react";
import { useEmployees } from "./hooks/useEmployees";
import { EmployeeListHeader } from "./list/EmployeeListHeader";
import { EmployeeSearch } from "./list/EmployeeSearch";
import { EmployeeTable } from "./list/EmployeeTable";
import { AddEmployeeDialog } from "./AddEmployeeDialog";

export const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTargets, setShowTargets] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { employees, loading, fetchEmployees } = useEmployees();

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
      <EmployeeListHeader onAddEmployee={() => setAddDialogOpen(true)} />
      <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {/* Employee add dialog */}
      <AddEmployeeDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onSuccess={fetchEmployees}
      />

      <EmployeeTable 
        filteredEmployees={filteredEmployees}
        showTargets={showTargets}
        toggleTargets={toggleTargets}
        loading={loading}
      />
    </div>
  );
};
