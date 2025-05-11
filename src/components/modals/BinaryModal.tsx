"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog";
import { BinaryForm } from "~/components/forms/BinaryForm";

interface BinaryModalProps {
  triggerLabel?: string;
  onSuccess?: () => void;
}

export function BinaryModal({
  triggerLabel = "Upload",
  onSuccess,
}: BinaryModalProps) {
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
        <Button>
          <UploadIcon className="h-4 w-4" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Binary File</DialogTitle>
          <DialogDescription>
            Upload a binary file and associate it with a car (optional).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <BinaryForm
            onSubmitSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
