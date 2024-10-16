"use strict";
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecmosRelations = exports.patientsRelations = exports.hospitalsRelations = exports.matchesRelations = exports.matches = exports.ecmos = exports.patients = exports.hospitals = exports.ecmoType = exports.specialCare = exports.createTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
exports.createTable = (0, pg_core_1.pgTableCreator)((name) => `ecmo-bridge_${name}`);
exports.specialCare = (0, pg_core_1.pgEnum)("special_care_category", [
    "PEDIATRIC",
    "FIRST_RESPONDERS",
    "SINGLE_CARETAKERS",
    "PREGNANT_PATIENTS",
    "SHORT_TERM_SURVIVAL",
]);
exports.ecmoType = (0, pg_core_1.pgEnum)("ecmo_type", ["PULMONARY", "CARDIAC", "ECPR"]);
exports.hospitals = (0, exports.createTable)("hospitals", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique(),
    userId: (0, pg_core_1.varchar)("userId", { length: 256 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull(),
    location: (0, pg_core_1.varchar)("location", { length: 256 }).notNull(),
    coordinates: (0, pg_core_1.json)("coordinates").notNull(),
    isVerified: (0, pg_core_1.boolean)("isVerified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updatedAt"),
}, (example) => ({
    nameIndex: (0, pg_core_1.index)("name_idx").on(example.name),
}));
exports.patients = (0, exports.createTable)("patients", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique(), // Using cuid for generating default IDs
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull(),
    age: (0, pg_core_1.integer)("age").notNull(),
    score: (0, pg_core_1.integer)("score").notNull(),
    specialCare: (0, exports.specialCare)("specialCare").notNull(), // Using SpecialCareCategory enum
    hospitalId: (0, pg_core_1.integer)("hospitalId")
        .references(() => exports.hospitals.id)
        .notNull(),
    isMatched: (0, pg_core_1.boolean)("is_matched").default(false).notNull(),
    ecmoType: (0, exports.ecmoType)("ecmoType").notNull(), // ECMOType is optional
    coordinates: (0, pg_core_1.json)("coordinates").notNull(), // Added JSON type for coordinates
    createdAt: (0, pg_core_1.timestamp)("created_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
});
exports.ecmos = (0, exports.createTable)("ecmos", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique(),
    model: (0, pg_core_1.varchar)("model", { length: 256 }).notNull(),
    serial: (0, pg_core_1.varchar)("serial", { length: 256 }).notNull(),
    inUse: (0, pg_core_1.boolean)("in_use").default(false).notNull(),
    isMatched: (0, pg_core_1.boolean)("is_matched").default(false).notNull(),
    coordinates: (0, pg_core_1.json)("coordinates").notNull(),
    hospitalId: (0, pg_core_1.integer)("hospitalId")
        .references(() => exports.hospitals.id)
        .notNull(),
    type: (0, exports.ecmoType)("type").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull(),
});
exports.matches = (0, exports.createTable)("matches", {
    id: (0, pg_core_1.serial)("id").primaryKey().unique(),
    patientId: (0, pg_core_1.integer)("patient_id")
        .references(() => exports.patients.id)
        .notNull(),
    hospitalId: (0, pg_core_1.integer)("hospital_id")
        .references(() => exports.hospitals.id)
        .notNull(),
    ecmoId: (0, pg_core_1.integer)("ecmo_id"),
    distance: (0, pg_core_1.doublePrecision)("distance"),
    duration: (0, pg_core_1.doublePrecision)("duration"),
    location: (0, pg_core_1.varchar)("location", { length: 256 }),
    matchedAt: (0, pg_core_1.timestamp)("matched_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
});
exports.matchesRelations = (0, drizzle_orm_1.relations)(exports.matches, ({ one }) => ({
    patient: one(exports.patients, {
        fields: [exports.matches.patientId],
        references: [exports.patients.id],
    }),
    hospital: one(exports.hospitals, {
        fields: [exports.matches.hospitalId],
        references: [exports.hospitals.id],
    }),
}));
exports.hospitalsRelations = (0, drizzle_orm_1.relations)(exports.hospitals, ({ many }) => ({
    patients: many(exports.patients),
    ecmos: many(exports.ecmos),
    matches: many(exports.matches),
}));
exports.patientsRelations = (0, drizzle_orm_1.relations)(exports.patients, ({ one }) => ({
    hospital: one(exports.hospitals, {
        fields: [exports.patients.hospitalId],
        references: [exports.hospitals.id],
    }),
}));
exports.ecmosRelations = (0, drizzle_orm_1.relations)(exports.ecmos, ({ one }) => ({
    hospital: one(exports.hospitals, {
        fields: [exports.ecmos.hospitalId],
        references: [exports.hospitals.id],
    }),
}));
