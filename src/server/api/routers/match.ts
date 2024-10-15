import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ecmos, patients, matches, hospitals } from "~/server/db/schema";
import { checkAuth } from "src/server/api/auth";
import { eq, and, or } from "drizzle-orm";
import { calculateDistance } from "../functions";

const deleteMatchSchema = z.object({
  patientId: z.number().optional(),
  ecmoId: z.number().optional(),
});

export const deleteMatch = async (
  ctx: any,
  input: z.infer<typeof deleteMatchSchema>,
) => {
  const { ecmoId, patientId } = input;

  if (!ecmoId && !patientId) {
    throw new Error("Either ecmoId or patientId must be provided");
  }

  // Handle removal by ecmoId
  if (ecmoId) {
    // Check for existing match
    const existingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.ecmoId, ecmoId),
    });

    if (existingMatch) {
      // Update the patient to set it as not matched
      await ctx.db
        .update(patients)
        .set({
          isMatched: false,
        })
        .where(eq(patients.id, existingMatch.patientId));

      // Update the ECMO machine to set it as not matched
      await ctx.db
        .update(ecmos)
        .set({
          isMatched: false,
        })
        .where(eq(ecmos.id, ecmoId));

      // Remove matches related to this ECMO machine
      await ctx.db.delete(matches).where(eq(matches.ecmoId, ecmoId));
    }
  }

  // Handle removal by patientId
  if (patientId) {
    // Find the match for the given patient
    const existingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.patientId, patientId),
    });

    if (existingMatch && existingMatch.ecmoId !== 0) {
      // Update the ECMO machine linked to this patient to set it as not matched and not in use
      await ctx.db
        .update(ecmos)
        .set({
          isMatched: false,
        })
        .where(eq(ecmos.id, existingMatch.ecmoId));

      // Update the patient to set it as not matched
      await ctx.db
        .update(patients)
        .set({
          isMatched: false,
        })
        .where(eq(patients.id, patientId));
      // Remove matches related to this patient
      await ctx.db.delete(matches).where(eq(matches.patientId, patientId));
    }
  }

  return { success: true };
};

export const matchRouter = createTRPCRouter({
  fetchMatches: publicProcedure.query(async ({ ctx }) => {
    // Get the user ID from the token
    const userId = checkAuth();

    // Find the hospital for the user
    const hospital = await ctx.db.query.hospitals.findFirst({
      where: eq(hospitals.userId, userId),
    });

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    const patientList = await ctx.db.query.patients.findMany({
      where: eq(patients.hospitalId, hospital.id),
    });

    if (patientList.length === 0) {
      throw new Error("No patients for your hospital are yet in queue.");
    }

    const matchesList = await ctx.db.query.matches.findMany({
      where: eq(matches.hospitalId, hospital.id),
    });

    if (matchesList.length === 0) {
      throw new Error("No matches found for your hospital.");
    }
    // Enhance matches with patient details
    const enhancedMatches = await Promise.all(
      matchesList.map(async (match) => {
        const patient = await ctx.db.query.patients.findFirst({
          where: eq(patients.id, match.patientId),
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
      }),
    );
    return enhancedMatches;
  }),
  fetchMatchCount: publicProcedure.query(async ({ ctx }) => {
    const userId = checkAuth();
    const hospital = await ctx.db.query.hospitals.findFirst({
      where: eq(hospitals.userId, userId),
    });
    if (!hospital) {
      throw new Error("Hospital not found");
    }
    const matchesList = await ctx.db.query.matches.findMany({
      where: eq(matches.hospitalId, hospital.id),
    });

    return matchesList.length;
  }),
  runMatch: publicProcedure.query(async ({ ctx }) => {
    const userId = checkAuth();
    const hospital = await ctx.db.query.hospitals.findFirst({
      where: eq(hospitals.userId, userId),
    });
    if (!hospital) {
      throw new Error("Hospital not found");
    }

    const patientList = await ctx.db.query.patients.findMany({
      where: eq(patients.hospitalId, hospital.id),
      orderBy: (patients, { desc }) => [desc(patients.score)],
      //TODO: Additional ordering by updatedAt can be included here (ascending)
    });

    if (patientList.length === 0) {
      throw new Error("No patients in queue to match.");
    }

    for (const patient of patientList) {
      // Fetch ECMOs each iteration to ensure they reflect the latest availability status
      const availableEcmos = await ctx.db.query.ecmos.findMany({
        where: and(eq(ecmos.inUse, false), eq(ecmos.isMatched, false)),
      });

      if (availableEcmos.length === 0) {
        continue; // No ECMOs available, skip to next patient
      }

      const ecmosWithSameType = availableEcmos.filter(
        (ecmo) => ecmo.type === patient.ecmoType,
      );

      if (ecmosWithSameType.length === 0) {
        continue; // No ECMOs of required type, skip to next patient
      }

      const distances = await Promise.all(
        ecmosWithSameType.map(async (ecmo) => {
          const { distance, duration } = await calculateDistance(
            patient.coordinates,
            ecmo.coordinates,
          );
          return {
            ecmo,
            distance,
            duration,
          };
        }),
      );

      const sortedEcmos = distances.sort((a, b) => a.distance - b.distance);
      const bestMatch = sortedEcmos[0];

      if (!bestMatch) {
        continue;
      }

      const existingMatch = await ctx.db.query.matches.findFirst({
        where: eq(matches.patientId, patient.id),
      });

      if (existingMatch && existingMatch.ecmoId !== null) {
        if (existingMatch.ecmoId !== bestMatch.ecmo.id) {
          const bestMatchHospital = await ctx.db.query.hospitals.findFirst({
            where: eq(hospitals.id, bestMatch.ecmo.hospitalId),
          });
          // ECMO change scenario
          await ctx.db
            .update(ecmos)
            .set({ isMatched: false })
            .where(eq(ecmos.id, existingMatch.ecmoId));

          await ctx.db
            .update(matches)
            .set({
              ecmoId: bestMatch.ecmo.id,
              location: bestMatchHospital?.location,
              distance: bestMatch.distance,
              duration: bestMatch.duration,
            })
            .where(eq(matches.id, existingMatch.id));

          await ctx.db
            .update(patients)
            .set({ isMatched: true })
            .where(eq(patients.id, patient.id));

          await ctx.db
            .update(ecmos)
            .set({ isMatched: true })
            .where(eq(ecmos.id, bestMatch.ecmo.id));
        }
      } else {
        const bestMatchHospital = await ctx.db.query.hospitals.findFirst({
          where: eq(hospitals.id, bestMatch.ecmo.hospitalId),
        });
        // New match scenario
        await ctx.db.insert(matches).values({
          patientId: patient.id,
          hospitalId: hospital.id,
          ecmoId: bestMatch.ecmo.id,
          location: bestMatchHospital?.location,
          distance: bestMatch.distance,
          duration: bestMatch.duration,
        });

        await ctx.db
          .update(patients)
          .set({ isMatched: true })
          .where(eq(patients.id, patient.id));

        await ctx.db
          .update(ecmos)
          .set({ isMatched: true })
          .where(eq(ecmos.id, bestMatch.ecmo.id));
      }
    }

    const matchList = await ctx.db.query.matches.findMany({
      where: eq(matches.hospitalId, hospital.id),
    });

    // Enhance matches with patient details
    const enhancedMatches = await Promise.all(
      matchList.map(async (match) => {
        const patient = await ctx.db.query.patients.findFirst({
          where: eq(patients.id, match.patientId),
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
      }),
    );
    return enhancedMatches;
  }),
});
