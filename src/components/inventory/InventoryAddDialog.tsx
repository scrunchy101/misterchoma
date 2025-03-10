
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
import { useInventory } from "./InventoryContext";

// Define form schema with Zod for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  threshold: z.coerce.number().min(0, "Threshold cannot be negative"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  supplier: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InventoryAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InventoryAddDialog = ({ isOpen, onOpenChange }: InventoryAddDialogProps) => {
  const { toast } = useToast();
  const { refreshInventory } = useInventory();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      stock: 0,
      unit: "",
      threshold: 0,
      cost: 0,
      supplier: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase.from("inventory").insert({
        name: data.name,
        category: data.category,
        stock: data.stock,
        unit: data.unit,
        threshold: data.threshold,
        cost: data.cost,
        supplier: data.supplier || null,
        last_updated: new Date().toISOString(),
      });

      if (error) throw error;

      // Refresh inventory items
      refreshInventory();
      
      toast({
        title: "Item Added",
        description: "The inventory item has been added successfully.",
      });
      
      // Close the dialog and reset form
      reset();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast({
        title: "Error",
        description: "Failed to add the inventory item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) reset();
      onOpenChange(open);
    }}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to add a new item to inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="Enter item name"
                {...register("name")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Beverage, Ingredient"
                {...register("category")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Current Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                {...register("stock")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="e.g., kg, liter, piece"
                {...register("unit")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Alert Threshold</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="0"
                {...register("threshold")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.threshold && (
                <p className="text-red-500 text-sm">{errors.threshold.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost (TZS)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                {...register("cost")}
                className="bg-gray-700 border-gray-600"
              />
              {errors.cost && (
                <p className="text-red-500 text-sm">{errors.cost.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier (Optional)</Label>
            <Input
              id="supplier"
              placeholder="Supplier name"
              {...register("supplier")}
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
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
