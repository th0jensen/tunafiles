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
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

// Zod schema based on Prisma model
const CarSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  engine: z.string().min(1, "Engine is required"),
});

type CarFormValues = z.infer<typeof CarSchema>;

interface CarFormProps {
  defaultValues?: Partial<CarFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function CarForm({ 
  defaultValues = { modelName: "", regNumber: "", engine: "" },
  onSubmitSuccess,
  onCancel
}: CarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const createCarMutation = api.car.createCar.useMutation({
    onSuccess: () => {
      toast({
        title: "Car Created",
        description: "The new car has been successfully added.",
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error Creating Car",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<CarFormValues>({
    resolver: zodResolver(CarSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CarFormValues) => {
    setIsSubmitting(true);
    createCarMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tesla Model S" {...field} />
              </FormControl>
              <FormDescription>
                Enter the model name of the car
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="regNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC123X" {...field} />
              </FormControl>
              <FormDescription>
                Enter the registration number (license plate)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="engine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engine Details</FormLabel>
              <FormControl>
                <Input placeholder="e.g., V8 Turbo, Electric 100kWh" {...field} />
              </FormControl>
              <FormDescription>
                Enter details about the engine
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
          <Button type="submit" disabled={isSubmitting || createCarMutation.isPending}>
            {isSubmitting || createCarMutation.isPending ? "Creating..." : "Create Car"}
          </Button>
        </div>
      </form>
    </Form>
  );
}