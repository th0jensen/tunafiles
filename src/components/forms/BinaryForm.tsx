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

// Zod schema based on Prisma model
const BinarySchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  filePath: z.string().min(1, "File path is required"),
  fileSize: z.coerce.number().min(0, "File size must be a positive number"),
  carId: z.coerce.number().optional(),
});

type BinaryFormValues = z.infer<typeof BinarySchema>;

// Mock data for cars
const mockCars = [
  { id: 1, modelName: "BMW 3 Series", regNumber: "ABC123" },
  { id: 2, modelName: "Audi A4", regNumber: "XYZ789" },
  { id: 3, modelName: "Mercedes C-Class", regNumber: "DEF456" },
];

interface BinaryFormProps {
  defaultValues?: Partial<BinaryFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function BinaryForm({ 
  defaultValues = { fileName: "", filePath: "", fileSize: 0, carId: undefined },
  onSubmitSuccess,
  onCancel
}: BinaryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Use mock data instead of API call
  const cars = mockCars;

  const form = useForm<BinaryFormValues>({
    resolver: zodResolver(BinarySchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: BinaryFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Creating binary:", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    } catch (error) {
      console.error("Error creating binary:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Placeholder for file upload - in a real app, this would handle actual file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("fileName", file.name);
      form.setValue("fileSize", file.size);
      // In a real app, you would upload the file to a server and get back a path
      form.setValue("filePath", `/uploads/${file.name}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel htmlFor="file">Upload Binary File</FormLabel>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload your binary file here. Supported formats include .bin, .hex, .dat
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., engine_tune_v1.bin" {...field} />
              </FormControl>
              <FormDescription>
                Name of the binary file
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="filePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Path</FormLabel>
              <FormControl>
                <Input placeholder="/uploads/filename.bin" {...field} disabled />
              </FormControl>
              <FormDescription>
                Path where the file is stored (auto-generated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fileSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Size (bytes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled />
              </FormControl>
              <FormDescription>
                Size of the file in bytes (auto-calculated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="carId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Car (Optional)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a car (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.modelName} - {car.regNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Associate this binary with a specific car (optional)
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Binary"}
          </Button>
        </div>
      </form>
    </Form>
  );
}