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
import { UserModal } from "~/components/modals/UserModal";
import { api } from "~/trpc/react";
import LoadingScreen from "~/components/LoadingScreen";

export default function UsersPage() {
  const { data: users = [], isLoading, refetch } = api.user.getUsers.useQuery();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <UserModal onSuccess={() => refetch()} />
      </div>

      {users && users.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.admin ? "Admin" : "User"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/users/${user.id}`}>View Details</Link>
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
            No Users Found
          </h2>
          <p className="mt-2 text-gray-500">
            Get started by adding a new user!
          </p>
        </div>
      )}
    </div>
  );
}
