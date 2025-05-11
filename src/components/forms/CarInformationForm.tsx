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
const CarInformationSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  generation: z.string().min(1, "Generation is required"),
  engine: z.string().min(1, "Engine is required"),
  year: z.string().min(4, "Year is required"), // We'll convert this to Date when submitting
  gearbox: z.string().min(1, "Gearbox is required"),
  ecuType: z.string().min(1, "ECU type is required"),
  ecuHardwareNumber: z.string().optional(),
  ecuSoftwareNumber: z.string().optional(),
  carId: z.coerce.number().min(1, "Car selection is required"),
});

type CarInformationFormValues = z.infer<typeof CarInformationSchema>;

// Mock data for cars
const mockCars = [
  { id: 1, modelName: "BMW 3 Series", regNumber: "ABC123" },
  { id: 2, modelName: "Audi A4", regNumber: "XYZ789" },
  { id: 3, modelName: "Mercedes C-Class", regNumber: "DEF456" },
];

interface CarInformationFormProps {
  defaultValues?: Partial<CarInformationFormValues>;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function CarInformationForm({ 
  defaultValues = {
    vehicleType: "",
    manufacturer: "",
    model: "",
    generation: "",
    engine: "",
    year: new Date().getFullYear().toString(),
    gearbox: "",
    ecuType: "",
    ecuHardwareNumber: "",
    ecuSoftwareNumber: "",
    carId: undefined
  },
  onSubmitSuccess,
  onCancel
}: CarInformationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Use mock data instead of API call
  const cars = mockCars;

  const form = useForm<CarInformationFormValues>({
    resolver: zodResolver(CarInformationSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CarInformationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would convert year string to Date object here
      const submissionData = {
        ...data,
        year: new Date(`${data.year}-01-01`) // Convert to Date for the API
      };
      
      console.log("Creating car information:", submissionData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      router.refresh();
    } catch (error) {
      console.error("Error creating car information:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                defaultValue={field.value?.toString()}
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
                Select the car to add information for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sedan, SUV, Truck" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Toyota, BMW, Ford" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Camry, 3-Series, F-150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="generation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mk7, 2nd Gen, 2018-2022" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2.0L Turbo, V8 5.0L" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gearbox"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gearbox</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Automatic, Manual, DCT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ecuType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ECU Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bosch, Continental, Denso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ecuHardwareNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ECU Hardware Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 0281012345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ecuSoftwareNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ECU Software Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 0281012345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Car Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
}