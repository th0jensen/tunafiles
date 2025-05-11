"use client";

import type React from "react";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { uploadFile } from "~/app/actions";

export function FileUpload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files ?? e.target.files![0]) {
      setFile(e.target.files![0]);
      setUploadStatus(null);
      return;
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFile(formData);

      setUploadStatus({
        success: true,
        message: `File uploaded successfully: ${result.filePath}`,
      });
    } catch (error) {
      setUploadStatus({
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {file ? (
            <p className="truncate text-sm font-medium">{file.name}</p>
          ) : (
            <p className="text-muted-foreground text-sm">No file selected</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="bg-muted hover:bg-muted/80 flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
          >
            <Upload className="h-4 w-4" />
            Upload
          </label>
          {file && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              variant="default"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`flex items-center rounded-md p-3 text-sm ${
            uploadStatus.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {uploadStatus.success ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4" />
          )}
          {uploadStatus.message}
        </div>
      )}
    </div>
  );
}
