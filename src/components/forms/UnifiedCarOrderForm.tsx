"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

// Zod schemas based on Prisma models
const CarSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  engine: z.string().min(1, "Engine is required"),
});

const CarInformationSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  generation: z.string().min(1, "Generation is required"),
  engine: z.string().min(1, "Engine is required"),
  year: z.string().min(4, "Year is required"),
  gearbox: z.string().min(1, "Gearbox is required"),
  ecuType: z.string().min(1, "ECU type is required"),
  ecuHardwareNumber: z.string().optional(),
  ecuSoftwareNumber: z.string().optional(),
});

const TagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  colour: z.string().min(1, "Colour is required"),
});

const OrderSchema = z.object({
  readTool: z.string().min(1, "Read tool is required"),
  requestedStage: z.string().min(1, "Requested stage is required"),
  userId: z.coerce.number().min(1, "User is required"),
});

const UnifiedSchema = z.object({
  car: CarSchema,
  carInformation: CarInformationSchema,
  tags: z.array(TagSchema).min(1, "At least one tag is required"),
  order: OrderSchema,
});

type UnifiedFormType = z.infer<typeof UnifiedSchema>;

export function UnifiedCarOrderForm() {
  const [activeTab, setActiveTab] = useState("car");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const { data: users = [] } = api.user.getUsers.useQuery();

  const form = useForm<UnifiedFormType>({
    resolver: zodResolver(UnifiedSchema),
    defaultValues: {
      car: { modelName: "", regNumber: "", engine: "" },
      carInformation: {
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
      },
      tags: [{ name: "", colour: "#3B82F6" }],
      order: { readTool: "", requestedStage: "", userId: undefined },
    },
    mode: "onChange",
  });

  if (submitted) {
    return (
      <Card className="mx-auto w-4xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">Success!</h2>
          <p className="mt-4 mb-6">
            Your car and order have been successfully created.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/cars")}>View Cars</Button>
            <Button onClick={() => router.push("/orders")}>View Orders</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                form.reset();
                setActiveTab("car");
              }}
            >
              Create Another
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto h-[70vh] w-2xl border-0 bg-transparent p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            return;
          })}
          className="space-y-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-4">
              <TabsTrigger value="car">Car</TabsTrigger>
              <TabsTrigger value="order">Order</TabsTrigger>
              <TabsTrigger value="carInfo">Details</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>

            {/* Car Details Tab */}
            <TabsContent value="car" className="space-y-6">
              <FormField
                control={form.control}
                name="car.modelName"
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
                name="car.regNumber"
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
                name="car.engine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., V8 Turbo, Electric 100kWh"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the engine specifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Car Information Tab */}
            <TabsContent value="carInfo" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="carInformation.vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sedan, SUV" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BMW, Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-Series, Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.generation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., F30, XV70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.0L Turbo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.year"
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
                  name="carInformation.gearbox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gearbox</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Automatic, Manual"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.ecuType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ECU Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Bosch, Continental"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carInformation.ecuHardwareNumber"
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
                  name="carInformation.ecuSoftwareNumber"
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
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags" className="space-y-6">
              <div>
                <FormLabel>Tags</FormLabel>
                <FormDescription className="mb-4">
                  Add at least one tag to categorize this car
                </FormDescription>

                {form.watch("tags").map((_, idx) => (
                  <div key={idx} className="mb-4 flex gap-2">
                    <FormField
                      control={form.control}
                      name={`tags.${idx}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Tag Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tags.${idx}.colour`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="color"
                              className="h-full w-20 p-1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("tags").length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const currentTags = form.getValues("tags");
                          const newTags = [...currentTags];
                          newTags.splice(idx, 1);
                          form.setValue("tags", newTags);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => {
                    const currentTags = form.getValues("tags");
                    form.setValue("tags", [
                      ...currentTags,
                      { name: "", colour: "#3B82F6" },
                    ]);
                  }}
                  className="mt-2"
                >
                  Add Tag
                </Button>
              </div>
            </TabsContent>

            {/* Order Details Tab */}
            <TabsContent value="order" className="space-y-6">
              <FormField
                control={form.control}
                name="order.readTool"
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
                name="order.requestedStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requested Stage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Stage 1, Stage 2, Custom"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the requested tuning stage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order.userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handled By</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
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
            </TabsContent>
            <button></button>
          </Tabs>
        </form>
      </Form>
    </Card>
  );
}
