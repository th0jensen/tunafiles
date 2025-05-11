import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const carInformationRouter = createTRPCRouter({
  getCarInformationById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.carInformation.findUnique({
        where: { id: input.id },
        include: { car: true },
      });
    }),

  createCarInformation: publicProcedure
    .input(
      z.object({
        carId: z.number(),
        vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
        manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
        model: z.string().min(1, { message: "Model is required" }),
        generation: z.string().min(1, { message: "Generation is required" }),
        engine: z.string().min(1, { message: "Engine is required" }),
        year: z.date(),
        gearbox: z.string().min(1, { message: "Gearbox is required" }),
        ecuType: z.string().min(1, { message: "ECU type is required" }),
        ecuHardwareNumber: z.string().optional(),
        ecuSoftwareNumber: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.carInformation.create({
        data: {
          car: { connect: { id: input.carId } },
          vehicleType: input.vehicleType,
          manufacturer: input.manufacturer,
          model: input.model,
          generation: input.generation,
          engine: input.engine,
          year: input.year,
          gearbox: input.gearbox,
          ecuType: input.ecuType,
          ecuHardwareNumber: input.ecuHardwareNumber,
          ecuSoftwareNumber: input.ecuSoftwareNumber,
        },
        include: { car: true },
      });
    }),

  getCarInformationForCar: publicProcedure
    .input(z.object({ carId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.carInformation.findMany({
        where: { id: input.carId },
        include: { car: true },
      });
    }),

  getCarInformationCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.carInformation.count();
  }),

  updateCarInformation: publicProcedure
    .input(
      z.object({
        id: z.number(),
        vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
        manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
        model: z.string().min(1, { message: "Model is required" }),
        generation: z.string().min(1, { message: "Generation is required" }),
        engine: z.string().min(1, { message: "Engine is required" }),
        year: z.date(),
        gearbox: z.string().min(1, { message: "Gearbox is required" }),
        ecuType: z.string().min(1, { message: "ECU type is required" }),
        ecuHardwareNumber: z.string().optional(),
        ecuSoftwareNumber: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.carInformation.update({
        where: { id: input.id },
        data: {
          vehicleType: input.vehicleType,
          manufacturer: input.manufacturer,
          model: input.model,
          generation: input.generation,
          engine: input.engine,
          year: input.year,
          gearbox: input.gearbox,
          ecuType: input.ecuType,
          ecuHardwareNumber: input.ecuHardwareNumber,
          ecuSoftwareNumber: input.ecuSoftwareNumber,
        },
      });
    }),

  deleteCarInformation: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.carInformation.delete({
        where: { id: input.id },
      });
    }),
});