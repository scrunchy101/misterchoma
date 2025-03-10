
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddEmployeeDialog = ({ open, onOpenChange, onSuccess }: AddEmployeeDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    status: "Active",
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position) {
      toast({
        title: "Missing information",
        description: "Name and position are required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('employees')
        .insert({
          name: formData.name,
          position: formData.position,
          email: formData.email || null,
          phone: formData.phone || null,
          status: formData.status,
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${formData.name} has been added to the team`,
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        status: "Active",
      });
      
      onOpenChange(false);
      onSuccess(); // Trigger refetch of employees
      
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-700 text-white border-gray-600 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-gray-800 border-gray-600 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Chef, Waiter, Manager, etc."
              className="bg-gray-800 border-gray-600 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="bg-gray-800 border-gray-600 focus:border-green-500"
              type="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className="bg-gray-800 border-gray-600 focus:border-green-500"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
