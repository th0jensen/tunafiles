"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function CarDetailPage() {
  const params = useParams();
  const carId = Number(params.id);

  const { data: car, error } = api.car.getCarById.useQuery(
    { id: carId },
    {
      enabled: !!carId && !isNaN(carId),
    },
  );

  if (error || !car) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500">
          Error: {error?.message ?? "Car not found."}
        </p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/cars">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cars">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">{car.modelName}</CardTitle>
          <CardDescription>Registration: {car.regNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Engine Details</h3>
            <p className="text-muted-foreground">{car.engine}</p>
          </div>
          {/* Add more car details here as needed */}
          {/* For example:
          <div>
            <h3 className="text-lg font-semibold">Created At</h3>
            <p className="text-muted-foreground">{new Date(car.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Last Updated</h3>
            <p className="text-muted-foreground">{new Date(car.updatedAt).toLocaleDateString()}</p>
          </div>
          */}
          <div className="pt-4">
            <Button>Order Service (Placeholder)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
