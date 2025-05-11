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
import { BinaryModal } from "~/components/modals/BinaryModal";
import { api } from "~/trpc/react";

export default function BinariesPage() {
  const { data: binaries = [], refetch } = api.binary.getBinaries.useQuery();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Binaries</h1>
        <BinaryModal onSuccess={() => refetch()} />
      </div>

      {binaries && binaries.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Associated Car</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {binaries.map((binary) => (
                <TableRow key={binary.id}>
                  <TableCell className="font-medium">
                    {binary.fileName}
                  </TableCell>
                  <TableCell>{formatFileSize(binary.fileSize)}</TableCell>
                  <TableCell>
                    {binary.car?.regNumber ?? "Not associated"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {binary.filePath}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/binaries/${binary.id}`}>View Details</Link>
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
            No Binaries Found
          </h2>
          <p className="mt-2 text-gray-500">
            Upload a binary file to get started!
          </p>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
}
