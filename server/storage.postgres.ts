import { 
  users, jobs, applications, messages, disputes, workNfts,
  type User, type InsertUser,
  type Job, type InsertJob,
  type Application, type InsertApplication,
  type Message, type InsertMessage,
  type Dispute, type InsertDispute,
  type WorkNft, type InsertWorkNft
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getJobs(filters?: { category?: string; status?: string }): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job>;
  
  getApplications(jobId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: Partial<Application>): Promise<Application>;
  
  getMessages(jobId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  getDisputes(jobId?: string): Promise<Dispute[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute>;
  
  getWorkNfts(userId: string): Promise<WorkNft[]>;
  createWorkNft(nft: InsertWorkNft): Promise<WorkNft>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getJobs(filters?: { category?: string; status?: string }): Promise<Job[]> {
    let query = db.select().from(jobs).orderBy(desc(jobs.createdAt));
    if (filters?.category && filters.category !== "All Categories") {
      query = query.where(eq(jobs.category, filters.category)) as any;
    }
    if (filters?.status) {
      query = query.where(eq(jobs.status, filters.status)) as any;
    }
    return await query;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async getApplications(jobId: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.createdAt));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async getMessages(jobId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.jobId, jobId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getDisputes(jobId?: string): Promise<Dispute[]> {
    let query = db.select().from(disputes).orderBy(desc(disputes.createdAt));
    if (jobId) {
      // drizzle eq requires explicit where, we cast any for chained
      query = query.where(eq(disputes.jobId, jobId)) as any;
    }
    return await query;
  }

  async createDispute(insertDispute: InsertDispute): Promise<Dispute> {
    const [dispute] = await db
      .insert(disputes)
      .values(insertDispute)
      .returning();
    return dispute;
  }

  async updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute> {
    const [dispute] = await db
      .update(disputes)
      .set(updates)
      .where(eq(disputes.id, id))
      .returning();
    return dispute;
  }

  async getWorkNfts(userId: string): Promise<WorkNft[]> {
    return await db
      .select()
      .from(workNfts)
      .where(eq(workNfts.freelancerId, userId))
      .orderBy(desc(workNfts.createdAt));
  }

  async createWorkNft(insertNft: InsertWorkNft): Promise<WorkNft> {
    const tokenId = `TG-NFT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    const polygonScanUrl = `https://polygonscan.com/token/${tokenId}`;
    const [nft] = await db
      .insert(workNfts)
      .values({ ...insertNft, tokenId, ipfsHash, polygonScanUrl })
      .returning();
    return nft;
  }
}


