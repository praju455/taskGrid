import type { 
  User, InsertUser, Job, InsertJob, Application, InsertApplication,
  Message, InsertMessage, Dispute, InsertDispute, WorkNft, InsertWorkNft
} from "@shared/schema";
import { getMongoDb } from "./mongo";
import { randomUUID } from "crypto";

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

function now() { return new Date(); }

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getMongoDb();
    const doc = await db.collection<User>("users").findOne({ id });
    return doc || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const db = await getMongoDb();
    const doc = await db.collection<User>("users").findOne({ walletAddress });
    return doc || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getMongoDb();
    const user: User = {
      id: insertUser.id || randomUUID(),
      walletAddress: insertUser.walletAddress,
      username: insertUser.username,
      bio: insertUser.bio || null as any,
      avatar: insertUser.avatar || null as any,
      skills: insertUser.skills || [],
      reputationScore: 0,
      totalEarned: "0",
      totalSpent: "0",
      completedJobs: 0,
      rating: "0" as any,
      createdAt: now() as any,
    };
    await db.collection("users").insertOne(user as any);
    return user;
  }

  async getJobs(filters?: { category?: string; status?: string }): Promise<Job[]> {
    const db = await getMongoDb();
    const query: any = {};
    if (filters?.category && filters.category !== "All Categories") query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    const items = await db.collection<Job>("jobs").find(query).sort({ createdAt: -1 }).toArray();
    return items;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const db = await getMongoDb();
    const job = await db.collection<Job>("jobs").findOne({ id });
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const db = await getMongoDb();
    const job: Job = {
      id: randomUUID(),
      clientId: insertJob.clientId,
      title: insertJob.title,
      description: insertJob.description,
      category: insertJob.category,
      budget: insertJob.budget,
      currency: insertJob.currency,
      deadline: insertJob.deadline as any,
      skills: insertJob.skills,
      status: "open" as any,
      escrowFunded: false,
      assignedFreelancerId: null as any,
      createdAt: now() as any,
      completedAt: null as any,
    };
    await db.collection("jobs").insertOne(job as any);
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const db = await getMongoDb();
    const res = await db.collection<Job>("jobs").findOneAndUpdate({ id }, { $set: updates }, { returnDocument: "after" });
    return res.value as Job;
  }

  async getApplications(jobId: string): Promise<Application[]> {
    const db = await getMongoDb();
    return await db.collection<Application>("applications").find({ jobId }).sort({ createdAt: -1 }).toArray();
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const db = await getMongoDb();
    const app: Application = {
      id: randomUUID(),
      jobId: insertApplication.jobId,
      freelancerId: insertApplication.freelancerId,
      proposal: insertApplication.proposal,
      estimatedDelivery: insertApplication.estimatedDelivery,
      portfolioLink: insertApplication.portfolioLink || null as any,
      status: "pending" as any,
      createdAt: now() as any,
    };
    await db.collection("applications").insertOne(app as any);
    return app;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const db = await getMongoDb();
    const res = await db.collection<Application>("applications").findOneAndUpdate({ id }, { $set: updates }, { returnDocument: "after" });
    return res.value as Application;
  }

  async getMessages(jobId: string): Promise<Message[]> {
    const db = await getMongoDb();
    return await db.collection<Message>("messages").find({ jobId }).sort({ createdAt: 1 }).toArray();
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const db = await getMongoDb();
    const msg: Message = {
      id: randomUUID(),
      jobId: insertMessage.jobId,
      senderId: insertMessage.senderId,
      content: insertMessage.content,
      createdAt: now() as any,
    };
    await db.collection("messages").insertOne(msg as any);
    return msg;
  }

  async getDisputes(jobId?: string): Promise<Dispute[]> {
    const db = await getMongoDb();
    const query: any = {};
    if (jobId) query.jobId = jobId;
    return await db.collection<Dispute>("disputes").find(query).sort({ createdAt: -1 }).toArray();
  }

  async createDispute(insertDispute: InsertDispute): Promise<Dispute> {
    const db = await getMongoDb();
    const d: Dispute = {
      id: randomUUID(),
      jobId: insertDispute.jobId,
      raisedBy: insertDispute.raisedBy,
      reason: insertDispute.reason,
      evidence: insertDispute.evidence || null as any,
      status: "open" as any,
      resolution: null as any,
      winner: null as any,
      aiRecommendation: null as any,
      createdAt: now() as any,
      resolvedAt: null as any,
    };
    await db.collection("disputes").insertOne(d as any);
    return d;
  }

  async updateDispute(id: string, updates: Partial<Dispute>): Promise<Dispute> {
    const db = await getMongoDb();
    const res = await db.collection<Dispute>("disputes").findOneAndUpdate({ id }, { $set: updates }, { returnDocument: "after" });
    return res.value as Dispute;
  }

  async getWorkNfts(userId: string): Promise<WorkNft[]> {
    const db = await getMongoDb();
    return await db.collection<WorkNft>("work_nfts").find({ freelancerId: userId }).sort({ createdAt: -1 }).toArray();
  }

  async createWorkNft(insertNft: InsertWorkNft): Promise<WorkNft> {
    const db = await getMongoDb();
    const tokenId = `TG-NFT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    const polygonScanUrl = `https://polygonscan.com/token/${tokenId}`;
    const nft: WorkNft = {
      id: randomUUID(),
      jobId: insertNft.jobId,
      freelancerId: insertNft.freelancerId,
      clientId: insertNft.clientId,
      jobTitle: insertNft.jobTitle,
      rating: insertNft.rating,
      amount: insertNft.amount,
      currency: insertNft.currency,
      tokenId: tokenId as any,
      ipfsHash: ipfsHash as any,
      polygonScanUrl: polygonScanUrl as any,
      createdAt: now() as any,
    };
    await db.collection("work_nfts").insertOne(nft as any);
    return nft;
  }
}


