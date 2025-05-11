import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        include: { orders: true },
      });
    }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Valid email is required" }),
        phone: z.string().min(1, { message: "Phone is required" }),
        admin: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          admin: input.admin,
        },
      });
    }),

  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      include: { orders: true },
      orderBy: { id: "asc" },
    });
  }),

  getUserCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Valid email is required" }),
        phone: z.string().min(1, { message: "Phone is required" }),
        admin: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          admin: input.admin,
        },
      });
    }),
});