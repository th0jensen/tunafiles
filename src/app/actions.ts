"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Define the upload directory - this will be in the project root
const UPLOAD_DIR = join(process.cwd(), "uploads");

export async function uploadFile(formData: FormData) {
  try {
    // Get the file from the FormData
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Create a unique filename
    const uniqueId = uuidv4();
    const originalName = file.name;
    const extension = originalName.split(".").pop();
    const fileName = `${uniqueId}.${extension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Ensure the upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to the server's file system
    await writeFile(filePath, buffer);

    return {
      success: true,
      fileName,
      filePath: `/uploads/${fileName}`,
      originalName,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
