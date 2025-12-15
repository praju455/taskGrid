import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  skills: text("skills").array().default(sql`ARRAY[]::text[]`),
  reputationScore: integer("reputation_score").notNull().default(0),
  totalEarned: decimal("total_earned", { precision: 18, scale: 2 }).notNull().default("0"),
  totalSpent: decimal("total_spent", { precision: 18, scale: 2 }).notNull().default("0"),
  completedJobs: integer("completed_jobs").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budget: decimal("budget", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  deadline: timestamp("deadline").notNull(),
  skills: text("skills").array().notNull(),
  status: text("status").notNull().default("open"),
  escrowFunded: boolean("escrow_funded").notNull().default(false),
  assignedFreelancerId: varchar("assigned_freelancer_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  freelancerId: varchar("freelancer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  proposal: text("proposal").notNull(),
  estimatedDelivery: text("estimated_delivery").notNull(),
  portfolioLink: text("portfolio_link"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const disputes = pgTable("disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  raisedBy: varchar("raised_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  evidence: text("evidence"),
  status: text("status").notNull().default("open"),
  resolution: text("resolution"),
  winner: varchar("winner").references(() => users.id, { onDelete: "set null" }),
  aiRecommendation: text("ai_recommendation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const workNfts = pgTable("work_nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  freelancerId: varchar("freelancer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobTitle: text("job_title").notNull(),
  rating: integer("rating").notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  tokenId: text("token_id"),
  ipfsHash: text("ipfs_hash"),
  polygonScanUrl: text("polygon_scan_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  jobsPosted: many(jobs, { relationName: "clientJobs" }),
  jobsAssigned: many(jobs, { relationName: "freelancerJobs" }),
  applications: many(applications),
  messages: many(messages),
  nftsEarned: many(workNfts, { relationName: "freelancerNfts" }),
  nftsIssued: many(workNfts, { relationName: "clientNfts" }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  client: one(users, {
    fields: [jobs.clientId],
    references: [users.id],
    relationName: "clientJobs",
  }),
  assignedFreelancer: one(users, {
    fields: [jobs.assignedFreelancerId],
    references: [users.id],
    relationName: "freelancerJobs",
  }),
  applications: many(applications),
  messages: many(messages),
  disputes: many(disputes),
  nft: many(workNfts),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  freelancer: one(users, {
    fields: [applications.freelancerId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  job: one(jobs, {
    fields: [messages.jobId],
    references: [jobs.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
  job: one(jobs, {
    fields: [disputes.jobId],
    references: [jobs.id],
  }),
  raiser: one(users, {
    fields: [disputes.raisedBy],
    references: [users.id],
  }),
}));

export const workNftsRelations = relations(workNfts, ({ one }) => ({
  job: one(jobs, {
    fields: [workNfts.jobId],
    references: [jobs.id],
  }),
  freelancer: one(users, {
    fields: [workNfts.freelancerId],
    references: [users.id],
    relationName: "freelancerNfts",
  }),
  client: one(users, {
    fields: [workNfts.clientId],
    references: [users.id],
    relationName: "clientNfts",
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  reputationScore: true,
  totalEarned: true,
  totalSpent: true,
  completedJobs: true,
  rating: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
  escrowFunded: true,
  assignedFreelancerId: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  status: true,
  resolution: true,
  winner: true,
  aiRecommendation: true,
});

export const insertWorkNftSchema = createInsertSchema(workNfts).omit({
  id: true,
  createdAt: true,
  tokenId: true,
  ipfsHash: true,
  polygonScanUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;

export type InsertWorkNft = z.infer<typeof insertWorkNftSchema>;
export type WorkNft = typeof workNfts.$inferSelect;
