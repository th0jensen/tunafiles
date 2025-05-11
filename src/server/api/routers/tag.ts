import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getTagById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.tag.findUnique({
        where: { id: input.id },
        include: { cars: true },
      });
    }),

  createTag: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Tag name is required" }),
        colour: z.string().min(1, { message: "Colour is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          name: input.name,
          colour: input.colour,
        },
      });
    }),

  getTags: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.findMany({
      include: { cars: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getTagCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.tag.count();
  }),

  deleteTag: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.delete({
        where: { id: input.id },
      });
    }),

  updateTag: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, { message: "Tag name is required" }),
        colour: z.string().min(1, { message: "Colour is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.update({
        where: { id: input.id },
        data: {
          name: input.name,
          colour: input.colour,
        },
      });
    }),
});