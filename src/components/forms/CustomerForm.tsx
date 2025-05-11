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
const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof CustomerSchema>;

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function CustomerForm({
  defaultValues = { name: "", phone: "", email: "" },
  onSubmitSuccess,
  onCancel,
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createCustomerMutation = api.customer.createCustomer.useMutation({
    onSuccess: () => {
      toast({
        title: "Customer Created",
        description: "The new customer has been successfully added.",
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error Creating Customer",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    createCustomerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., John Doe or Company Inc."
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter the name of the customer</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., +1 (555) 123-4567"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {"Enter the customer's phone number"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., user@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {"Enter the customer's email address"}
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
          <Button
            type="submit"
            disabled={isSubmitting || createCustomerMutation.isPending}
          >
            {isSubmitting || createCustomerMutation.isPending
              ? "Creating..."
              : "Create Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
