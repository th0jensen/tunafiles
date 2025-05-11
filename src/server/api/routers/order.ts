import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  getOrderById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findUnique({
        where: { id: input.id },
        include: { car: true, handledBy: true },
      });
    }),

  createOrder: publicProcedure
    .input(
      z.object({
        carId: z.number(),
        userId: z.number(),
        readTool: z.string().min(1, { message: "Read tool is required" }),
        requestedStage: z.string().min(1, { message: "Requested stage is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.create({
        data: {
          carId: input.carId,
          userId: input.userId,
          readTool: input.readTool,
          requestedStage: input.requestedStage,
        },
        include: { car: true, handledBy: true },
      });
    }),

  getOrders: publicProcedure.query(({ ctx }) => {
    return ctx.db.order.findMany({
      include: { car: true, handledBy: true },
      orderBy: { id: "desc" },
    });
  }),

  getRecentOrders: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findMany({
        take: input.limit,
        include: { car: true, handledBy: true },
        orderBy: { id: "desc" },
      });
    }),

  getOrderCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.order.count();
  }),

  deleteOrder: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.delete({
        where: { id: input.id },
      });
    }),

  updateOrder: publicProcedure
    .input(
      z.object({
        id: z.number(),
        carId: z.number(),
        userId: z.number(),
        readTool: z.string().min(1, { message: "Read tool is required" }),
        requestedStage: z.string().min(1, { message: "Requested stage is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.update({
        where: { id: input.id },
        data: {
          carId: input.carId,
          userId: input.userId,
          readTool: input.readTool,
          requestedStage: input.requestedStage,
        },
      });
    }),
});