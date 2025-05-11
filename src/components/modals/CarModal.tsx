"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog";
import { CarForm } from "~/components/forms/CarForm";

interface CarModalProps {
  triggerLabel?: string;
  onSuccess?: () => void;
}

export function CarModal({
  triggerLabel = "Add New",
  onSuccess,
}: CarModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogDescription>
            Enter the details for the new car.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CarForm
            onSubmitSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
