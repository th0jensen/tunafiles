"use client";

import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";
import { CarModal } from "~/components/modals/CarModal";
import { api } from "~/trpc/react";

export default function CarsDashboardPage() {
  const { data: cars = [], refetch } = api.car.getCars.useQuery();

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cars</h1>
        <CarModal onSuccess={() => refetch()} />
      </div>

      {cars && cars.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Registration Number</TableHead>
                <TableHead>Engine</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.modelName}</TableCell>
                  <TableCell>{car.regNumber}</TableCell>
                  <TableCell>{car.engine}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cars/${car.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border py-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">No Cars Found</h2>
          <p className="mt-2 text-gray-500">Get started by adding a new car!</p>
        </div>
      )}
    </div>
  );
}
