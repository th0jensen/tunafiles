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
import { CustomerModal } from "~/components/modals/CustomerModal";
import { api } from "~/trpc/react";

export default function CustomersPage() {
  const { data: customers = [], refetch } =
    api.customer.getCustomers.useQuery();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <CustomerModal onSuccess={() => refetch()} />
      </div>

      {customers && customers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email ?? "—"}</TableCell>
                  <TableCell>{customer.phone ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/customers/${customer.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border py-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Customers Found
          </h2>
          <p className="mt-2 text-gray-500">
            Get started by adding a new customer!
          </p>
        </div>
      )}
    </div>
  );
}
