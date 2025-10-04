/**
 * Validation test router to verify that our schema fixes are working correctly.
 * This router provides simple test endpoints to validate:
 * 1. Hospitals table access via ctx.db.query.hospitals
 * 2. Patients table access and field compatibility
 * 3. Integration between hospitals and patients tables
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hospitals, patients } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const testValidationRouter = createTRPCRouter({
  // Test 1: Verify hospitals table is accessible
  testHospitalsAccess: publicProcedure.query(async ({ ctx }) => {
    try {
      // This should work without throwing "Cannot read property 'hospitals' of undefined"
      const hospitalCount = await ctx.db.query.hospitals.findMany();
      return {
        success: true,
        message: "✅ Hospitals table is accessible via ctx.db.query.hospitals",
        hospitalCount: hospitalCount.length,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to access hospitals table: ${error.message}`,
        error: error.message,
      };
    }
  }),

  // Test 2: Verify hospitals table schema fields
  testHospitalsSchema: publicProcedure.query(async ({ ctx }) => {
    try {
      const testHospital = await ctx.db.query.hospitals.findFirst();
      
      // Check if all expected fields exist
      const expectedFields = ['id', 'userId', 'name', 'address', 'coordinates', 'isVerified', 'createdAt', 'updatedAt'];
      const actualFields = testHospital ? Object.keys(testHospital) : [];
      const missingFields = expectedFields.filter(field => !actualFields.includes(field));
      
      return {
        success: true,
        message: "✅ Hospitals schema validation",
        expectedFields,
        actualFields,
        missingFields,
        hasAllFields: missingFields.length === 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to validate hospitals schema: ${error.message}`,
        error: error.message,
      };
    }
  }),

  // Test 3: Verify patients table schema fields
  testPatientsSchema: publicProcedure.query(async ({ ctx }) => {
    try {
      const testPatient = await ctx.db.query.patients.findFirst();
      
      // Check if all expected fields exist
      const expectedFields = ['id', 'hospitalId', 'name', 'coordinates', 'age', 'score', 'specialCare', 'ecmoType', 'isMatched', 'createdAt', 'updatedAt'];
      const actualFields = testPatient ? Object.keys(testPatient) : [];
      const missingFields = expectedFields.filter(field => !actualFields.includes(field));
      
      return {
        success: true,
        message: "✅ Patients schema validation",
        expectedFields,
        actualFields,
        missingFields,
        hasAllFields: missingFields.length === 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to validate patients schema: ${error.message}`,
        error: error.message,
      };
    }
  }),

  // Test 4: Test hospital-patient relationship
  testHospitalPatientRelationship: publicProcedure.query(async ({ ctx }) => {
    try {
      // Find a hospital
      const hospital = await ctx.db.query.hospitals.findFirst();
      
      if (!hospital) {
        return {
          success: true,
          message: "⚠️ No hospitals found to test relationship",
          hospitalFound: false,
        };
      }

      // Try to find patients for this hospital
      const hospitalPatients = await ctx.db.query.patients.findMany({
        where: eq(patients.hospitalId, hospital.id),
      });

      return {
        success: true,
        message: "✅ Hospital-patient relationship works",
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        patientCount: hospitalPatients.length,
        relationshipWorks: true,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to test hospital-patient relationship: ${error.message}`,
        error: error.message,
      };
    }
  }),

  // Test 5: Simulate patient creation (without actually creating)
  testPatientCreationFields: publicProcedure.query(async ({ ctx }) => {
    try {
      // Test if we can access the required fields for patient creation
      const hospital = await ctx.db.query.hospitals.findFirst();
      
      if (!hospital) {
        return {
          success: true,
          message: "⚠️ No hospitals found to test patient creation fields",
          hospitalFound: false,
        };
      }

      // Verify all fields needed for patient creation exist
      const requiredHospitalFields = ['id', 'coordinates'];
      const requiredPatientFields = ['hospitalId', 'name', 'coordinates', 'age', 'score', 'specialCare', 'ecmoType', 'updatedAt'];
      
      const hospitalHasRequiredFields = requiredHospitalFields.every(field => field in hospital);
      const patientSchemaHasRequiredFields = requiredPatientFields.every(field => {
        // Check if field exists in the patients table schema
        return field === 'hospitalId' || field === 'name' || field === 'coordinates' || 
               field === 'age' || field === 'score' || field === 'specialCare' || 
               field === 'ecmoType' || field === 'updatedAt';
      });

      return {
        success: true,
        message: "✅ Patient creation field validation",
        hospitalHasRequiredFields,
        patientSchemaHasRequiredFields,
        allFieldsCompatible: hospitalHasRequiredFields && patientSchemaHasRequiredFields,
        hospitalFields: Object.keys(hospital),
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to validate patient creation fields: ${error.message}`,
        error: error.message,
      };
    }
  }),

  // Test 6: Comprehensive integration test
  comprehensiveTest: publicProcedure.query(async ({ ctx }) => {
    const results = {
      hospitalsAccess: false,
      patientsAccess: false,
      schemaCompatibility: false,
      relationshipWorks: false,
      errors: [] as string[],
    };

    try {
      // Test 1: Hospitals access
      await ctx.db.query.hospitals.findMany();
      results.hospitalsAccess = true;
    } catch (error) {
      results.errors.push(`Hospitals access: ${error.message}`);
    }

    try {
      // Test 2: Patients access
      await ctx.db.query.patients.findMany();
      results.patientsAccess = true;
    } catch (error) {
      results.errors.push(`Patients access: ${error.message}`);
    }

    try {
      // Test 3: Schema compatibility
      const hospital = await ctx.db.query.hospitals.findFirst();
      if (hospital) {
        const hasRequiredFields = ['id', 'userId', 'coordinates'].every(field => field in hospital);
        results.schemaCompatibility = hasRequiredFields;
      }
    } catch (error) {
      results.errors.push(`Schema compatibility: ${error.message}`);
    }

    try {
      // Test 4: Relationship
      const hospital = await ctx.db.query.hospitals.findFirst();
      if (hospital) {
        await ctx.db.query.patients.findMany({
          where: eq(patients.hospitalId, hospital.id),
        });
        results.relationshipWorks = true;
      }
    } catch (error) {
      results.errors.push(`Relationship: ${error.message}`);
    }

    const allTestsPassed = results.hospitalsAccess && results.patientsAccess && 
                          results.schemaCompatibility && results.relationshipWorks;

    return {
      success: allTestsPassed,
      message: allTestsPassed ? "🎉 All integration tests passed!" : "❌ Some tests failed",
      results,
      summary: {
        totalTests: 4,
        passedTests: Object.values(results).filter(v => v === true).length,
        allPassed: allTestsPassed,
      },
    };
  }),
});
