import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { checkAuth } from "../functions";
import mongoose from 'mongoose';

// Define MongoDB Hospital Schema
const HospitalSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  location: { type: String, required: true, maxlength: 100 },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  isVerified: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

// Create or get existing model
const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);

export const createHospitalSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export const hospitalRouter = createTRPCRouter({
  create: publicProcedure
    .input(createHospitalSchema)
    .mutation(async ({ input }) => {
      const userId = checkAuth();

      // Check if hospital already exists
      const existingHospital = await Hospital.findOne({ userId });

      if (existingHospital) {
        throw new Error("Hospital already exists");
      }

      // Create new hospital
      const hospital = new Hospital({
        userId,
        name: input.name,
        location: input.location,
        coordinates: input.coordinates,
        isVerified: true,
        updatedAt: new Date(),
      });

      await hospital.save();
      return hospital;
    }),

  get: publicProcedure.query(async () => {
    const userId = checkAuth();

    // Find hospital by userId
    const hospital = await Hospital.findOne({ userId });
    return hospital;
  }),
});
