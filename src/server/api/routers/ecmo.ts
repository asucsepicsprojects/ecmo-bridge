import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { checkAuth } from "../functions";
import mongoose, { Document, Model } from 'mongoose';

// Define MongoDB ECMO Schema
const ECMOSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patientId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'Discontinued'], 
    default: 'Active' 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define TypeScript interface for ECMO
interface ECMODocument extends Document {
  userId: string;
  patientId: string;
  startDate: Date;
  endDate?: Date;
  status: 'Active' | 'Completed' | 'Discontinued';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define model type
interface ECMOModel extends Model<ECMODocument> {}

// Create or get existing model
const ECMO = mongoose.models.ECMO as ECMOModel || mongoose.model<ECMODocument>('ECMO', ECMOSchema);

export const createECMOSchema = z.object({
  patientId: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.enum(['Active', 'Completed', 'Discontinued']).optional(),
  notes: z.string().optional(),
});

export const ecmoRouter = createTRPCRouter({
  create: publicProcedure
    .input(createECMOSchema)
    .mutation(async ({ input }) => {
      const userId = checkAuth();

      const ecmo = new ECMO({
        userId,
        patientId: input.patientId,
        startDate: input.startDate,
        endDate: input.endDate,
        status: input.status || 'Active',
        notes: input.notes,
      });

      await ecmo.save();
      return ecmo;
    }),

  getAll: publicProcedure.query(async () => {
    const userId = checkAuth();

    // Find all ECMOs for the user
    const ecmos = await ECMO.find({ userId });
    return ecmos;
  }),

  update: publicProcedure
    .input(createECMOSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userId = checkAuth();

      const updatedECMO = await ECMO.findOneAndUpdate(
        { _id: input.id, userId },
        {
          patientId: input.patientId,
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
          notes: input.notes,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedECMO) {
        throw new Error('ECMO not found');
      }

      return updatedECMO;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userId = checkAuth();

      const deletedECMO = await ECMO.findOneAndDelete({ 
        _id: input.id, 
        userId 
      });

      if (!deletedECMO) {
        throw new Error('ECMO not found');
      }

      return deletedECMO;
    }),
});
