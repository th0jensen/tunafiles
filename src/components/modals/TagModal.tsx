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
import { TagForm } from "~/components/forms/TagForm";

interface TagModalProps {
  triggerLabel?: string;
  onSuccess?: () => void;
}

export function TagModal({
  triggerLabel = "Create",
  onSuccess,
}: TagModalProps) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
          <DialogDescription>
            Enter the details for the new tag.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TagForm
            onSubmitSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
