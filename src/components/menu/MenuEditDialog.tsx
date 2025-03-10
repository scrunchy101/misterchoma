
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "./MenuContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/hooks/useMenuItems";

interface MenuEditDialogProps {
  item: MenuItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  description: z.string().optional(),
  available: z.boolean().default(true),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const MenuEditDialog = ({ item, isOpen, onOpenChange }: MenuEditDialogProps) => {
  const { toast } = useToast();
  const { refreshMenu, categories } = useMenu();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || "",
      available: item.available,
      image_url: item.image_url || "",
    },
  });

  const available = watch("available");

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description || null,
          available: data.available,
          image_url: data.image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);
        
      if (error) throw error;
      
      await refreshMenu();
      
      toast({
        title: "Menu Item Updated",
        description: `${data.name} has been updated successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              {...register("name")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="relative">
              <Input
                id="category"
                {...register("category")}
                className="bg-gray-700 border-gray-600"
                list="category-options"
              />
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (TZS)</Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              className="bg-gray-700 border-gray-600"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              {...register("image_url")}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={available}
              onCheckedChange={(checked) => setValue("available", checked)}
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available for Order
            </Label>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
