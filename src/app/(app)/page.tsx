"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { PlusCircle, Car, ShoppingCart, Tag, Info } from "lucide-react";
import { UnifiedCarOrderForm } from "~/components/forms/UnifiedCarOrderForm";
import { api } from "~/trpc/react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { data: cars = [] } = api.car.getCars.useQuery();
  const { data: orders = [] } = api.order.getOrders.useQuery();
  const carCount = cars.length;
  const orderCount = orders.length;
  const recentOrders = orders.slice(0, 5);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <UnifiedCarOrderForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carCount}</div>
            <p className="text-muted-foreground text-xs">
              Registered in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
            <p className="text-muted-foreground text-xs">
              Processed and pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Info className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-muted-foreground text-xs">
              Orders in the last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Tag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/cars">Cars</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/orders">Orders</Link>
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/users">Users</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/customers">Customers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Overview of the most recent orders in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-muted-foreground text-sm">
                      Car: {order.car.regNumber} | Stage: {order.requestedStage}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No recent orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
