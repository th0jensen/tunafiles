import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const binaryRouter = createTRPCRouter({
  getBinaryById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.binary.findUnique({
        where: { id: input.id },
        include: { car: true },
      });
    }),

  createBinary: publicProcedure
    .input(
      z.object({
        fileName: z.string().min(1, { message: "File name is required" }),
        filePath: z.string().min(1, { message: "File path is required" }),
        fileSize: z.number().min(0, { message: "File size must be a positive number" }),
        carId: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.binary.create({
        data: {
          fileName: input.fileName,
          filePath: input.filePath,
          fileSize: input.fileSize,
          carId: input.carId ?? null,
        },
        include: { car: true },
      });
    }),

  getBinaries: publicProcedure.query(({ ctx }) => {
    return ctx.db.binary.findMany({
      include: { car: true },
      orderBy: { id: "desc" },
    });
  }),

  getBinaryCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.binary.count();
  }),

  deleteBinary: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.binary.delete({
        where: { id: input.id },
      });
    }),

  updateBinary: publicProcedure
    .input(
      z.object({
        id: z.number(),
        fileName: z.string().min(1, { message: "File name is required" }),
        filePath: z.string().min(1, { message: "File path is required" }),
        fileSize: z.number().min(0, { message: "File size must be a positive number" }),
        carId: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.binary.update({
        where: { id: input.id },
        data: {
          fileName: input.fileName,
          filePath: input.filePath,
          fileSize: input.fileSize,
          carId: input.carId ?? null,
        },
      });
    }),

  getBinariesForCar: publicProcedure
    .input(z.object({ carId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.binary.findMany({
        where: { carId: input.carId },
        orderBy: { id: "desc" },
      });
    }),
});