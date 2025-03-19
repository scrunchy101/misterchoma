
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useMenu } from "./MenuContext";
import { MenuItem } from "@/hooks/useMenuItems";

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

export type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemFormProps {
  defaultValues: MenuItem;
  onSubmit: (data: MenuItemFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText: string;
  cancelButtonText: string;
}

export const MenuItemForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  submitButtonText,
  cancelButtonText
}: MenuItemFormProps) => {
  const { categories } = useMenu();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues.name,
      category: defaultValues.category,
      price: defaultValues.price,
      description: defaultValues.description || "",
      available: defaultValues.available,
      image_url: defaultValues.image_url || "",
    },
  });

  const available = watch("available");

  return (
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
          onClick={onCancel}
          className="border-gray-600"
        >
          {cancelButtonText}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </DialogFooter>
    </form>
  );
};
