"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

// Zod schema based on Prisma model
const OrderSchema = z.object({
  carId: z.coerce.number().min(1, "Car selection is required"),
  userId: z.coerce.number().min(1, "User selection is required"),
  readTool: z.string().min(1, "Read tool is required"),
  requestedStage: z.string().min(1, "Requested stage is required"),
});

type OrderFormValues = z.infer<typeof OrderSchema>;

interface OrderFormProps {
  defaultValues?: Partial<OrderFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderForm({ 
  defaultValues = { carId: undefined, userId: undefined, readTool: "", requestedStage: "" },
  onSubmitSuccess,
  onCancel
}: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { data: cars = [] } = api.car.getCars.useQuery();
  const { data: users = [] } = api.user.getUsers.useQuery();
  
  const createOrderMutation = api.order.createOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "The new order has been successfully added.",
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error Creating Order",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true);
    createOrderMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="carId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.modelName} - {car.regNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the car for this order
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handled By</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the user who will handle this order
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="readTool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Read Tool</FormLabel>
              <FormControl>
                <Input placeholder="e.g., MPPS, KESS, KTag" {...field} />
              </FormControl>
              <FormDescription>
                Enter the tool used to read the ECU
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="requestedStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Stage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Stage 1, Stage 2, Custom" {...field} />
              </FormControl>
              <FormDescription>
                Enter the requested tuning stage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || createOrderMutation.isPending}>
            {isSubmitting || createOrderMutation.isPending ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}