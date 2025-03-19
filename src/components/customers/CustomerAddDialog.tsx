
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define form schema with Zod for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 characters").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded?: () => void;
}

export const CustomerAddDialog = ({ isOpen, onOpenChange, onCustomerAdded }: CustomerAddDialogProps) => {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase.from("customers").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      toast({
        title: "Customer Added",
        description: "The customer has been added successfully.",
      });
      
      // Close the dialog and reset form
      reset();
      onOpenChange(false);
      
      // Refresh customer list if callback provided
      if (onCustomerAdded) {
        onCustomerAdded();
      }
      
    } catch (error: any) {
      console.error("Error adding customer:", error);
      
      // Check for duplicate email error
      if (error.code === '23505') {
        toast({
          title: "Email Already Exists",
          description: "A customer with this email address already exists.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add the customer. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) reset();
      onOpenChange(open);
    }}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to add a new customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              {...register("name")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              {...register("email")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              placeholder="+255 123 456 789"
              {...register("phone")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="Enter address"
              {...register("address")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Additional information"
              {...register("notes")}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
