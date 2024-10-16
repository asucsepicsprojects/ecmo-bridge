"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalRouter = exports.createHospitalSchema = void 0;
const zod_1 = require("zod");
const trpc_1 = require("~/server/api/trpc");
const schema_1 = require("~/server/db/schema");
const auth_1 = require("src/server/api/auth");
exports.createHospitalSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    location: zod_1.z.string().min(1).max(100),
    coordinates: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
});
exports.hospitalRouter = (0, trpc_1.createTRPCRouter)({
    create: trpc_1.publicProcedure
        .input(exports.createHospitalSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            return await ctx.db.insert(schema_1.hospitals).values({
                userId,
                name: input.name,
                location: input.location,
                coordinates: input.coordinates,
                isVerified: true,
                updatedAt: new Date(),
            });
        }
        throw new Error("Hospital already exists");
    }),
    get: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        return await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
    }),
});
