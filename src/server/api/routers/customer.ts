import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const customerRouter = createTRPCRouter({
  getCustomerById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.customer.findUnique({
        where: { id: input.id },
      });
    }),

  createCustomer: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        },
      });
    }),

  getCustomers: publicProcedure.query(({ ctx }) => {
    return ctx.db.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getCustomerCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.customer.count();
  }),

  deleteCustomer: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.delete({
        where: { id: input.id },
      });
    }),

  updateCustomer: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        },
      });
    }),
});