import { carRouter } from "~/server/api/routers/car";
import { tagRouter } from "~/server/api/routers/tag";
import { customerRouter } from "~/server/api/routers/customer";
import { userRouter } from "~/server/api/routers/user";
import { orderRouter } from "~/server/api/routers/order";
import { binaryRouter } from "~/server/api/routers/binary";
import { carInformationRouter } from "~/server/api/routers/carInformation";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  car: carRouter,
  tag: tagRouter,
  customer: customerRouter,
  user: userRouter,
  order: orderRouter,
  binary: binaryRouter,
  carInformation: carInformationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);