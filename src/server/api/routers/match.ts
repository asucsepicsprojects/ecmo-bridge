import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { checkAuth } from "../functions";
import mongoose from 'mongoose';
import { calculateDistance } from "../functions";

// Define MongoDB schemas for related collections
const PatientSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  isMatched: { type: Boolean, default: false },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const ECMOSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patientId: { type: String },
  model: { type: String, required: true },
  serial: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['PULMONARY', 'CARDIAC', 'ECPR'], 
    required: true 
  },
  isMatched: { type: Boolean, default: false },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const MatchSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patientId: { type: String, required: true },
  ecmoId: { type: String, required: true },
  matchedAt: { type: Date, default: Date.now },
});

// Create or get existing models
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
const ECMO = mongoose.models.ECMO || mongoose.model('ECMO', ECMOSchema);
const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);

const deleteMatchSchema = z.object({
  patientId: z.string().optional(),
  ecmoId: z.string().optional(),
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
    const existingMatch = await Match.findOne({ ecmoId });

    if (existingMatch) {
      // Update the patient to set it as not matched
      await Patient.findByIdAndUpdate(existingMatch.patientId, {
        isMatched: false,
      });

      // Update the ECMO machine to set it as not matched
      await ECMO.findByIdAndUpdate(ecmoId, {
        isMatched: false,
        patientId: null,
      });

      // Remove matches related to this ECMO machine
      await Match.deleteOne({ ecmoId });
    }
  }

  // Handle removal by patientId
  if (patientId) {
    // Check for existing match
    const existingMatch = await Match.findOne({ patientId });

    if (existingMatch) {
      // Update the patient to set it as not matched
      await Patient.findByIdAndUpdate(patientId, {
        isMatched: false,
      });

      // Update the ECMO machine to set it as not matched
      await ECMO.findByIdAndUpdate(existingMatch.ecmoId, {
        isMatched: false,
        patientId: null,
      });

      // Remove matches related to this patient
      await Match.deleteOne({ patientId });
    }
  }
};

export const matchRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      patientId: z.string(),
      ecmoId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const userId = checkAuth();

      // Verify patient and ECMO exist and are not already matched
      const patient = await Patient.findById(input.patientId);
      const ecmo = await ECMO.findById(input.ecmoId);

      if (!patient || !ecmo) {
        throw new Error("Patient or ECMO not found");
      }

      if (patient.isMatched || ecmo.isMatched) {
        throw new Error("Patient or ECMO is already matched");
      }

      // Create new match
      const match = new Match({
        userId,
        patientId: input.patientId,
        ecmoId: input.ecmoId,
      });

      // Update patient and ECMO to mark as matched
      await Patient.findByIdAndUpdate(input.patientId, { 
        isMatched: true 
      });
      await ECMO.findByIdAndUpdate(input.ecmoId, { 
        isMatched: true,
        patientId: input.patientId,
      });

      await match.save();
      return match;
    }),

  getAll: publicProcedure.query(async () => {
    const userId = checkAuth();

    // Get all matches for the user
    const matches = await Match.find({ userId });
    return matches;
  }),

  runMatch: publicProcedure.query(async () => {
    const userId = checkAuth();

    // Get all matches for the user with populated data
    const matches = await Match.find({ userId })
      .populate('patientId')
      .populate('ecmoId');

    // Transform the data to match the expected format in the UI
    const transformedMatches = matches.map((match: any) => ({
      id: match._id,
      patientName: match.patientId?.name || 'Unknown Patient',
      ecmoType: match.ecmoId?.type || 'Unknown Type',
      ecmoId: match.ecmoId?._id || null,
      location: match.ecmoId?.coordinates ? `${match.ecmoId.coordinates.lat}, ${match.ecmoId.coordinates.lng}` : null,
      distance: null, // TODO: Calculate distance if needed
      duration: null, // TODO: Calculate duration if needed
    }));

    return transformedMatches;
  }),

  findPotentialMatches: publicProcedure
    .input(z.object({
      patientId: z.string(),
      maxDistance: z.number().optional().default(500), // km
    }))
    .query(async ({ input }) => {
      const userId = checkAuth();

      // Find the patient
      const patient = await Patient.findById(input.patientId);
      if (!patient) {
        throw new Error("Patient not found");
      }

      // Find unmatched ECMOs within the specified distance
      const unMatchedECMOs = await ECMO.find({ 
        userId, 
        isMatched: false 
      });

      // Filter ECMOs based on distance
      const potentialMatches = unMatchedECMOs.filter(ecmo => {
        const distance = calculateDistance(
          patient.coordinates.lat, 
          patient.coordinates.lng, 
          ecmo.coordinates.lat, 
          ecmo.coordinates.lng
        );
        return distance <= input.maxDistance;
      });

      return potentialMatches;
    }),
});
