"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecmoRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("~/server/api/trpc");
const schema_1 = require("~/server/db/schema");
const auth_1 = require("src/server/api/auth");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const match_1 = require("./match");
const newEcmoSchema = zod_1.z.object({
    model: zod_1.z.string().min(1).max(100),
    serial: zod_1.z.string().min(1).max(150),
    type: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]),
    inUse: zod_1.z.boolean().default(false),
});
const editEcmoSchema = zod_1.z.object({
    id: zod_1.z.number(),
    model: zod_1.z.string().min(1).max(100).optional(),
    serial: zod_1.z.string().min(1).max(150).optional(),
    type: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]).optional(),
    inUse: zod_1.z.boolean().default(false).optional(),
});
const getEcmoSchema = zod_1.z.object({
    type: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]).optional(),
    inUse: zod_1.z.boolean().optional(),
});
exports.ecmoRouter = (0, trpc_1.createTRPCRouter)({
    create: trpc_1.publicProcedure
        .input(newEcmoSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        const newEcmo = await ctx.db.insert(schema_1.ecmos).values({
            hospitalId: hospital.id,
            coordinates: hospital.coordinates,
            isMatched: false,
            model: input.model,
            serial: input.serial,
            type: input.type,
            inUse: input.inUse,
            updatedAt: new Date(),
        });
        return newEcmo;
    }),
    edit: trpc_1.publicProcedure
        .input(editEcmoSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const ecmo = await ctx.db.query.ecmos.findFirst({
            where: (model, { eq }) => eq(model.id, input.id),
        });
        if (!ecmo) {
            throw new Error("ECMO not found");
        }
        await (0, match_1.deleteMatch)(ctx, { ecmoId: ecmo.id });
        return await ctx.db
            .update(schema_1.ecmos)
            .set({
            model: input.model,
            serial: input.serial,
            type: input.type,
            inUse: input.inUse,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, ecmo.id));
    }),
    get: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db.query.ecmos.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.ecmos.hospitalId, hospital.id),
        });
    }),
    getCount: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db
            .select({ count: (0, drizzle_orm_2.count)() })
            .from(schema_1.ecmos)
            .where((0, drizzle_orm_1.eq)(schema_1.ecmos.hospitalId, hospital.id));
    }),
    delete: trpc_1.publicProcedure
        .input(editEcmoSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        await (0, match_1.deleteMatch)(ctx, { ecmoId: input.id });
        return await ctx.db.delete(schema_1.ecmos).where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, input.id));
    }),
    getAll: trpc_1.publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.ecmos.findMany();
    }),
    getBy: trpc_1.publicProcedure.input(getEcmoSchema).query(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db.query.ecmos.findMany({
            where: (model, { eq }) => {
                if (input.type) {
                    return eq(model.type, input.type);
                }
                if (input.inUse) {
                    return eq(model.inUse, input.inUse);
                }
            },
        });
    }),
});
