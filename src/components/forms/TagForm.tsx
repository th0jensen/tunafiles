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
const TagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  colour: z.string().min(1, "Colour is required"),
});

type TagFormValues = z.infer<typeof TagSchema>;

interface TagFormProps {
  defaultValues?: Partial<TagFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function TagForm({ 
  defaultValues = { name: "", colour: "#3B82F6" },
  onSubmitSuccess,
  onCancel
}: TagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const createTagMutation = api.tag.createTag.useMutation({
    onSuccess: () => {
      toast({
        title: "Tag Created",
        description: "The new tag has been successfully added.",
      });
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Error Creating Tag",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<TagFormValues>({
    resolver: zodResolver(TagSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: TagFormValues) => {
    setIsSubmitting(true);
    createTagMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Performance, Sport, Eco" {...field} />
              </FormControl>
              <FormDescription>
                Enter a name for the tag
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="colour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colour</FormLabel>
              <FormControl>
                <div className="flex space-x-2 items-center">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1"
                    {...field}
                  />
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g., #FF5733"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Choose a color for the tag
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
          <Button type="submit" disabled={isSubmitting || createTagMutation.isPending}>
            {isSubmitting || createTagMutation.isPending ? "Creating..." : "Create Tag"}
          </Button>
        </div>
      </form>
    </Form>
  );
}