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
import { OrderModal } from "~/components/modals/OrderModal";
import { api } from "~/trpc/react";

export default function OrdersPage() {
  const { data: orders = [], refetch } = api.order.getOrders.useQuery();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <OrderModal onSuccess={() => refetch()} />
      </div>

      {orders && orders.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Handled By</TableHead>
                <TableHead>Read Tool</TableHead>
                <TableHead>Requested Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.car?.regNumber || "Unknown"}</TableCell>
                  <TableCell>{order.handledBy?.name || "Unknown"}</TableCell>
                  <TableCell>{order.readTool}</TableCell>
                  <TableCell>{order.requestedStage}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>View Details</Link>
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
            No Orders Found
          </h2>
          <p className="mt-2 text-gray-500">
            Get started by adding a new order!
          </p>
        </div>
      )}
    </div>
  );
}
