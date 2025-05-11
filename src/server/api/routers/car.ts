import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const carRouter = createTRPCRouter({
  getCarById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.car.findUnique({
        where: { id: input.id },
        // You can include relations here if needed, e.g.:
        // include: { CarInformation: true, tags: true, binaries: true },
      });
    }),

  createCar: publicProcedure
    .input(
      z.object({
        modelName: z.string().min(1, { message: "Model name is required" }),
        regNumber: z.string().min(1, { message: "Registration number is required" }),
        engine: z.string().min(1, { message: "Engine details are required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.car.create({
        data: {
          modelName: input.modelName,
          regNumber: input.regNumber,
          engine: input.engine,
        },
      });
    }),

  getCars: publicProcedure.query(({ ctx }) => {
    return ctx.db.car.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});