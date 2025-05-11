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
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

// Zod schema based on Prisma model
const UserSchema = z.object({
  name: z.string().min(1, "User name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  admin: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof UserSchema>;

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({
  defaultValues = { name: "", email: "", phone: "", admin: false },
  onSubmitSuccess,
  onCancel,
}: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createUserMutation = api.user.createUser.useMutation({
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "The new user has been successfully added.",
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error Creating User",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    createUserMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormDescription>{"Enter the user's full name"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., user@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {"Enter the user's email address"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., +1 (555) 123-4567"
                  type="tel"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {"Enter the user's phone number"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Administrator</FormLabel>
                <FormDescription>
                  This user will have administrative privileges
                </FormDescription>
              </div>
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
            disabled={isSubmitting || createUserMutation.isPending}
          >
            {isSubmitting || createUserMutation.isPending
              ? "Creating..."
              : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
