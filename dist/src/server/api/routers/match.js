"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRouter = exports.deleteMatch = void 0;
const zod_1 = require("zod");
const trpc_1 = require("~/server/api/trpc");
const schema_1 = require("~/server/db/schema");
const auth_1 = require("src/server/api/auth");
const drizzle_orm_1 = require("drizzle-orm");
const functions_1 = require("../functions");
const deleteMatchSchema = zod_1.z.object({
    patientId: zod_1.z.number().optional(),
    ecmoId: zod_1.z.number().optional(),
});
const deleteMatch = async (ctx, input) => {
    const { ecmoId, patientId } = input;
    if (!ecmoId && !patientId) {
        throw new Error("Either ecmoId or patientId must be provided");
    }
    // Handle removal by ecmoId
    if (ecmoId) {
        // Check for existing match
        const existingMatch = await ctx.db.query.matches.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.matches.ecmoId, ecmoId),
        });
        if (existingMatch) {
            // Update the patient to set it as not matched
            await ctx.db
                .update(schema_1.patients)
                .set({
                isMatched: false,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.patients.id, existingMatch.patientId));
            // Update the ECMO machine to set it as not matched
            await ctx.db
                .update(schema_1.ecmos)
                .set({
                isMatched: false,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, ecmoId));
            // Remove matches related to this ECMO machine
            await ctx.db.delete(schema_1.matches).where((0, drizzle_orm_1.eq)(schema_1.matches.ecmoId, ecmoId));
        }
    }
    // Handle removal by patientId
    if (patientId) {
        // Find the match for the given patient
        const existingMatch = await ctx.db.query.matches.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.matches.patientId, patientId),
        });
        if (existingMatch && existingMatch.ecmoId !== 0) {
            // Update the ECMO machine linked to this patient to set it as not matched and not in use
            await ctx.db
                .update(schema_1.ecmos)
                .set({
                isMatched: false,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, existingMatch.ecmoId));
            // Update the patient to set it as not matched
            await ctx.db
                .update(schema_1.patients)
                .set({
                isMatched: false,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.patients.id, patientId));
            // Remove matches related to this patient
            await ctx.db.delete(schema_1.matches).where((0, drizzle_orm_1.eq)(schema_1.matches.patientId, patientId));
        }
    }
    return { success: true };
};
exports.deleteMatch = deleteMatch;
exports.matchRouter = (0, trpc_1.createTRPCRouter)({
    fetchMatches: trpc_1.publicProcedure.query(async ({ ctx }) => {
        // Get the user ID from the token
        const userId = (0, auth_1.checkAuth)();
        // Find the hospital for the user
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.hospitals.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        const patientList = await ctx.db.query.patients.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.patients.hospitalId, hospital.id),
        });
        if (patientList.length === 0) {
            throw new Error("No patients for your hospital are yet in queue.");
        }
        const matchesList = await ctx.db.query.matches.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.matches.hospitalId, hospital.id),
        });
        if (matchesList.length === 0) {
            throw new Error("No matches found for your hospital.");
        }
        // Enhance matches with patient details
        const enhancedMatches = await Promise.all(matchesList.map(async (match) => {
            const patient = await ctx.db.query.patients.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.patients.id, match.patientId),
            });
            return {
                id: match.id,
                patientName: patient ? patient.name : "Unknown", // Fallback to 'Unknown' if patient not found
                ecmoType: patient ? patient.ecmoType : "Unknown", // Fallback to 'Unknown' if patient not found
                ecmoId: match.ecmoId,
                location: match.location,
                distance: match.distance,
                duration: match.duration,
            };
        }));
        return enhancedMatches;
    }),
    fetchMatchCount: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.hospitals.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        const matchesList = await ctx.db.query.matches.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.matches.hospitalId, hospital.id),
        });
        return matchesList.length;
    }),
    runMatch: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const userId = (0, auth_1.checkAuth)();
        const hospital = await ctx.db.query.hospitals.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.hospitals.userId, userId),
        });
        if (!hospital) {
            throw new Error("Hospital not found");
        }
        const patientList = await ctx.db.query.patients.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.patients.hospitalId, hospital.id),
            orderBy: (patients, { desc }) => [desc(patients.score)],
            //TODO: Additional ordering by updatedAt can be included here (ascending)
        });
        if (patientList.length === 0) {
            throw new Error("No patients in queue to match.");
        }
        for (const patient of patientList) {
            // Fetch ECMOs each iteration to ensure they reflect the latest availability status
            const availableEcmos = await ctx.db.query.ecmos.findMany({
                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.ecmos.inUse, false), (0, drizzle_orm_1.eq)(schema_1.ecmos.isMatched, false)),
            });
            if (availableEcmos.length === 0) {
                continue; // No ECMOs available, skip to next patient
            }
            const ecmosWithSameType = availableEcmos.filter((ecmo) => ecmo.type === patient.ecmoType);
            if (ecmosWithSameType.length === 0) {
                continue; // No ECMOs of required type, skip to next patient
            }
            const distances = await Promise.all(ecmosWithSameType.map(async (ecmo) => {
                const { distance, duration } = await (0, functions_1.calculateDistance)(patient.coordinates, ecmo.coordinates);
                return {
                    ecmo,
                    distance,
                    duration,
                };
            }));
            const sortedEcmos = distances.sort((a, b) => a.distance - b.distance);
            const bestMatch = sortedEcmos[0];
            if (!bestMatch) {
                continue;
            }
            const existingMatch = await ctx.db.query.matches.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.matches.patientId, patient.id),
            });
            if (existingMatch && existingMatch.ecmoId !== null) {
                if (existingMatch.ecmoId !== bestMatch.ecmo.id) {
                    const bestMatchHospital = await ctx.db.query.hospitals.findFirst({
                        where: (0, drizzle_orm_1.eq)(schema_1.hospitals.id, bestMatch.ecmo.hospitalId),
                    });
                    // ECMO change scenario
                    await ctx.db
                        .update(schema_1.ecmos)
                        .set({ isMatched: false })
                        .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, existingMatch.ecmoId));
                    await ctx.db
                        .update(schema_1.matches)
                        .set({
                        ecmoId: bestMatch.ecmo.id,
                        location: bestMatchHospital?.location,
                        distance: bestMatch.distance,
                        duration: bestMatch.duration,
                    })
                        .where((0, drizzle_orm_1.eq)(schema_1.matches.id, existingMatch.id));
                    await ctx.db
                        .update(schema_1.patients)
                        .set({ isMatched: true })
                        .where((0, drizzle_orm_1.eq)(schema_1.patients.id, patient.id));
                    await ctx.db
                        .update(schema_1.ecmos)
                        .set({ isMatched: true })
                        .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, bestMatch.ecmo.id));
                }
            }
            else {
                const bestMatchHospital = await ctx.db.query.hospitals.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.hospitals.id, bestMatch.ecmo.hospitalId),
                });
                // New match scenario
                await ctx.db.insert(schema_1.matches).values({
                    patientId: patient.id,
                    hospitalId: hospital.id,
                    ecmoId: bestMatch.ecmo.id,
                    location: bestMatchHospital?.location,
                    distance: bestMatch.distance,
                    duration: bestMatch.duration,
                });
                await ctx.db
                    .update(schema_1.patients)
                    .set({ isMatched: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.patients.id, patient.id));
                await ctx.db
                    .update(schema_1.ecmos)
                    .set({ isMatched: true })
                    .where((0, drizzle_orm_1.eq)(schema_1.ecmos.id, bestMatch.ecmo.id));
            }
        }
        const matchList = await ctx.db.query.matches.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.matches.hospitalId, hospital.id),
        });
        // Enhance matches with patient details
        const enhancedMatches = await Promise.all(matchList.map(async (match) => {
            const patient = await ctx.db.query.patients.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.patients.id, match.patientId),
            });
            return {
                id: match.id,
                patientName: patient ? patient.name : "Unknown", // Fallback to 'Unknown' if patient not found
                ecmoType: patient ? patient.ecmoType : "Unknown", // Fallback to 'Unknown' if patient not found
                ecmoId: match.ecmoId,
                location: match.location,
                distance: match.distance,
                duration: match.duration,
            };
        }));
        return enhancedMatches;
    }),
});
