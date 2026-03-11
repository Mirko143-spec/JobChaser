import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  externalJobId: varchar('external_job_id', { length: 200 }),
  company: varchar('company', { length: 200 }).notNull(),
  logo: varchar('logo', { length: 200 }),
  position: varchar('position', { length: 200 }).notNull(),
  role: varchar('role', { length: 200 }),
  level: varchar('level', { length: 200 }),
  postedAt: varchar('posted_at', { length: 200 }),
  contract: varchar('contract', { length: 200 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
}));

