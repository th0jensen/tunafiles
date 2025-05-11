"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const carFormSchema = z.object({
  modelName: z.string().min(1, {
    message: "Model name is required.",
  }),
  regNumber: z.string().min(1, {
    message: "Registration number is required.",
  }),
  engine: z.string().min(1, {
    message: "Engine details are required.",
  }),
});

type CarFormValues = z.infer<typeof carFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CarFormValues> = {
  modelName: "",
  regNumber: "",
  engine: "",
};

export default function NewCarPage() {
  const router = useRouter();
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createCarMutation = api.car.createCar.useMutation({
    onSuccess: () => {
      toast({
        title: "Car Created",
        description: "The new car has been successfully added.",
      });
      router.push("/cars"); // Redirect after successful creation
      router.refresh(); // Refresh the page to show the new car in the list if on the same page or for other components
    },
    onError: (error) => {
      toast({
        title: "Error Creating Car",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: CarFormValues) {
    createCarMutation.mutate(data);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Car</h1>
        <Button variant="outline" asChild>
          <Link href="/cars">Cancel</Link>
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Tesla Model S" {...field} />
                </FormControl>
                <FormDescription>The model name of the car.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ABC123X" {...field} />
                </FormControl>
                <FormDescription>
                  The registration number (e.g., license plate) of the car.
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
                  <Input
                    placeholder="e.g., V8 Turbo, Electric 100kWh"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {
                    "Specific details about the car's engine (e.g., V8 Turbo, Electric 100kWh)."
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createCarMutation.isPending}>
            {createCarMutation.isPending ? "Creating..." : "Create Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
