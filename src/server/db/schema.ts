import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  hospitalId: uuid('hospital_id'),
  status: text('status', { enum: ['Active', 'Inactive'] }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 