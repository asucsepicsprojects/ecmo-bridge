import { hospitalRouter } from "~/server/api/routers/hospital";
import { patientRouter } from "~/server/api/routers/patient";
import { ecmoRouter } from "~/server/api/routers/ecmo";
import { matchRouter } from "~/server/api/routers/match";
import { chatRouter } from "~/server/api/routers/chat";
import { userRouter } from "~/server/api/routers/user";
import { testValidationRouter } from "~/server/api/routers/test-validation";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  hospital: hospitalRouter,
  patient: patientRouter,
  ecmo: ecmoRouter,
  match: matchRouter,
  chat: chatRouter,
  user: userRouter,
  testValidation: testValidationRouter,
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
