"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaller = exports.appRouter = void 0;
const hospital_1 = require("~/server/api/routers/hospital");
const patient_1 = require("~/server/api/routers/patient");
const ecmo_1 = require("~/server/api/routers/ecmo");
const match_1 = require("~/server/api/routers/match");
const trpc_1 = require("~/server/api/trpc");
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    hospital: hospital_1.hospitalRouter,
    patient: patient_1.patientRouter,
    ecmo: ecmo_1.ecmoRouter,
    match: match_1.matchRouter,
});
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
exports.createCaller = (0, trpc_1.createCallerFactory)(exports.appRouter);
