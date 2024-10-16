"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("~/server/api/trpc");
const schema_1 = require("~/server/db/schema");
const auth_1 = require("src/server/api/auth");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const match_1 = require("./match");
const drizzle_orm_3 = require("drizzle-orm");
const newPatientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    age: zod_1.z.number().min(1).max(150),
    specialCare: zod_1.z.enum([
        "PEDIATRIC",
        "FIRST_RESPONDERS",
        "SINGLE_CARETAKERS",
        "PREGNANT_PATIENTS",
        "SHORT_TERM_SURVIVAL",
    ]),
    ecmoType: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]),
});
const editPatientSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).max(100).optional(),
    age: zod_1.z.number().min(1).max(150).optional(),
    specialCare: zod_1.z
        .enum([
        "PEDIATRIC",
        "FIRST_RESPONDERS",
        "SINGLE_CARETAKERS",
        "PREGNANT_PATIENTS",
        "SHORT_TERM_SURVIVAL",
    ])
        .optional(),
    ecmoType: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]).optional(),
});
const getPatientSchema = zod_1.z.object({
    specialCare: zod_1.z
        .enum([
        "PEDIATRIC",
        "FIRST_RESPONDERS",
        "SINGLE_CARETAKERS",
        "PREGNANT_PATIENTS",
        "SHORT_TERM_SURVIVAL",
    ])
        .optional(),
    ecmoType: zod_1.z.enum(["PULMONARY", "CARDIAC", "ECPR"]).optional(),
});
function computeScore(specialCare) {
    switch (specialCare) {
        case "PEDIATRIC":
            return 5;
        case "FIRST_RESPONDERS":
            return 4;
        case "SINGLE_CARETAKERS":
            return 3;
        case "PREGNANT_PATIENTS":
            return 2;
        case "SHORT_TERM_SURVIVAL":
            return 1;
        default:
            return 0; // Default score for unspecified or unknown categories
    }
}
exports.patientRouter = (0, trpc_1.createTRPCRouter)({
    create: trpc_1.publicProcedure
        .input(newPatientSchema)
        .mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        const score = computeScore(input.specialCare);
        const newPatient = await ctx.db.insert(schema_1.patients).values({
            hospitalId: hospital.id,
            name: input.name,
            coordinates: hospital.coordinates,
            age: input.age,
            score: score,
            specialCare: input.specialCare,
            ecmoType: input.ecmoType,
            updatedAt: new Date(),
        });
        return newPatient;
    }),
    edit: trpc_1.publicProcedure
        .input(editPatientSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const patient = await ctx.db.query.patients.findFirst({
            where: (model, { eq }) => eq(model.id, input.id),
        });
        if (!patient) {
            throw new Error("Patient not found");
        }
        let score = 0;
        if (input.specialCare) {
            score = computeScore(input.specialCare);
        }
        else {
            score = patient.score;
        }
        // Delete the match for the patient
        await (0, match_1.deleteMatch)(ctx, { patientId: input.id });
        return await ctx.db
            .update(schema_1.patients)
            .set({
            name: input.name,
            age: input.age,
            score: score,
            specialCare: input.specialCare,
            ecmoType: input.ecmoType,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.patients.id, patient.id));
    }),
    get: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db.query.patients.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.patients.hospitalId, hospital.id),
        });
    }),
    getMatched: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db.query.patients.findMany({
            where: (model, { eq }) => (0, drizzle_orm_3.and)(eq(model.hospitalId, hospital.id), eq(model.isMatched, true)),
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
            .from(schema_1.patients)
            .where((0, drizzle_orm_1.eq)(schema_1.patients.hospitalId, hospital.id));
    }),
    delete: trpc_1.publicProcedure
        .input(editPatientSchema)
        .mutation(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        await (0, match_1.deleteMatch)(ctx, { patientId: input.id });
        return await ctx.db.delete(schema_1.patients).where((0, drizzle_orm_1.eq)(schema_1.patients.id, input.id));
    }),
    getAll: trpc_1.publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.patients.findMany();
    }),
    getBy: trpc_1.publicProcedure
        .input(getPatientSchema)
        .query(async ({ ctx, input }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (model, { eq }) => eq(model.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        return await ctx.db.query.patients.findMany({
            where: (model, { eq, and }) => {
                if (input.ecmoType && input.specialCare) {
                    return and(eq(model.hospitalId, hospital.id), eq(model.ecmoType, input.ecmoType), eq(model.specialCare, input.specialCare));
                }
                else if (input.ecmoType) {
                    return and(eq(model.hospitalId, hospital.id), eq(model.ecmoType, input.ecmoType));
                }
                else if (input.specialCare) {
                    return and(eq(model.hospitalId, hospital.id), eq(model.specialCare, input.specialCare));
                }
                else {
                    throw new Error("Either ecmoType or specialCare must be provided");
                }
            },
        });
    }),
});
