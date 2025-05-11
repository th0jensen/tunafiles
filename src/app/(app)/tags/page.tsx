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
import { TagModal } from "~/components/modals/TagModal";
import { api } from "~/trpc/react";
import LoadingScreen from "~/components/LoadingScreen";

export default function TagsPage() {
  const { data: tags = [], isLoading, refetch } = api.tag.getTags.useQuery();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags</h1>
        <TagModal onSuccess={() => refetch()} />
      </div>

      {tags && tags.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.colour }}
                      />
                      <span>{tag.colour}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tag.cars?.length || 0} cars</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tags/${tag.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border py-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">No Tags Found</h2>
          <p className="mt-2 text-gray-500">Get started by adding a new tag!</p>
        </div>
      )}
    </div>
  );
}
