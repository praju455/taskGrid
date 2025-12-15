import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { matchJobsToFreelancer, resolveDispute } from "./openai";
import { insertJobSchema, insertApplicationSchema, insertMessageSchema, insertDisputeSchema } from "@shared/schema";
import { getAvailableCoins, getQuote, createFixedShift, getShiftStatus, convertToBaseCurrency } from "./sideshift";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/jobs", async (req, res) => {
    try {
      const { category, search } = req.query;
      const jobs = await storage.getJobs({
        category: category as string,
        status: "open",
      });
      
      const jobsWithRelations = await Promise.all(
        jobs.map(async (job) => {
          const client = await storage.getUser(job.clientId);
          const applications = await storage.getApplications(job.id);
          return {
            ...job,
            client,
            _count: { applications: applications.length },
          };
        })
      );
      
      res.json(jobsWithRelations);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/active", async (req, res) => {
    try {
      const jobs = await storage.getJobs({ status: "in_progress" });
      
      const jobsWithRelations = await Promise.all(
        jobs.map(async (job) => {
          const client = await storage.getUser(job.clientId);
          const assignedFreelancer = job.assignedFreelancerId
            ? await storage.getUser(job.assignedFreelancerId)
            : undefined;
          return {
            ...job,
            client,
            assignedFreelancer,
          };
        })
      );
      
      res.json(jobsWithRelations);
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      res.status(500).json({ error: "Failed to fetch active jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const job = await storage.getJob(id);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      const client = await storage.getUser(job.clientId);
      const applications = await storage.getApplications(job.id);
      
      const applicationsWithFreelancers = await Promise.all(
        applications.map(async (app) => {
          const freelancer = await storage.getUser(app.freelancerId);
          return { ...app, freelancer };
        })
      );
      
      res.json({
        ...job,
        client,
        applications: applicationsWithFreelancers,
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const data = { ...req.body };
      if (typeof data.deadline === 'string') {
        data.deadline = new Date(data.deadline);
      }
      const validatedData = insertJobSchema.parse(data);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(400).json({ error: "Failed to create job" });
    }
  });

  app.patch("/api/jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const job = await storage.updateJob(id, updates);
      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(400).json({ error: "Failed to update job" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(400).json({ error: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const application = await storage.updateApplication(id, updates);
      
      if (updates.status === "accepted" && application.jobId) {
        await storage.updateJob(application.jobId, {
          assignedFreelancerId: application.freelancerId,
          status: "in_progress",
        });
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(400).json({ error: "Failed to update application" });
    }
  });

  app.get("/api/messages/:jobId", async (req, res) => {
    try {
      const { jobId } = req.params;
      const messages = await storage.getMessages(jobId);
      
      const messagesWithSenders = await Promise.all(
        messages.map(async (msg) => {
          const sender = await storage.getUser(msg.senderId);
          return { ...msg, sender };
        })
      );
      
      res.json(messagesWithSenders);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ error: "Failed to create message" });
    }
  });

  app.get("/api/disputes", async (req, res) => {
    try {
      const { jobId } = req.query;
      const disputes = await storage.getDisputes(jobId as string);
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  app.post("/api/disputes", async (req, res) => {
    try {
      const validatedData = insertDisputeSchema.parse(req.body);
      const dispute = await storage.createDispute(validatedData);
      
      const job = await storage.getJob(validatedData.jobId);
      if (job) {
        const aiResolution = await resolveDispute({
          jobTitle: job.title,
          clientEvidence: validatedData.evidence || "",
          reason: validatedData.reason,
        });
        
        await storage.updateDispute(dispute.id, {
          aiRecommendation: JSON.stringify(aiResolution),
        });
      }
      
      res.status(201).json(dispute);
    } catch (error) {
      console.error("Error creating dispute:", error);
      res.status(400).json({ error: "Failed to create dispute" });
    }
  });

  app.patch("/api/disputes/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const { winner, resolution } = req.body;
      
      const dispute = await storage.updateDispute(id, {
        status: "resolved",
        winner,
        resolution,
        resolvedAt: new Date(),
      });
      
      res.json(dispute);
    } catch (error) {
      console.error("Error resolving dispute:", error);
      res.status(400).json({ error: "Failed to resolve dispute" });
    }
  });

  app.get("/api/nfts/recent", async (req, res) => {
    try {
      const mockNfts = [];
      res.json(mockNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  app.get("/api/nfts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const nfts = await storage.getWorkNfts(userId);
      
      const nftsWithClients = await Promise.all(
        nfts.map(async (nft) => {
          const client = await storage.getUser(nft.clientId);
          return { ...nft, client };
        })
      );
      
      res.json(nftsWithClients);
    } catch (error) {
      console.error("Error fetching user NFTs:", error);
      res.status(500).json({ error: "Failed to fetch user NFTs" });
    }
  });

  app.post("/api/jobs/:jobId/complete", async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await storage.getJob(jobId);
      
      if (!job || !job.assignedFreelancerId) {
        return res.status(400).json({ error: "Invalid job state" });
      }
      
      await storage.updateJob(jobId, {
        status: "completed",
        completedAt: new Date(),
      });
      
      const nft = await storage.createWorkNft({
        jobId: job.id,
        freelancerId: job.assignedFreelancerId,
        clientId: job.clientId,
        jobTitle: job.title,
        rating: 5,
        amount: job.budget,
        currency: job.currency,
      });
      
      const client = await storage.getUser(job.clientId);
      const freelancer = await storage.getUser(job.assignedFreelancerId);
      
      if (client) {
        await storage.updateJob(job.id, {});
      }
      
      if (freelancer) {
        const newTotalEarned = parseFloat(freelancer.totalEarned) + parseFloat(job.budget);
        const newCompletedJobs = freelancer.completedJobs + 1;
      }
      
      res.json({ job, nft });
    } catch (error) {
      console.error("Error completing job:", error);
      res.status(400).json({ error: "Failed to complete job" });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const nfts = await storage.getWorkNfts(user.id);
      
      const nftsWithClients = await Promise.all(
        nfts.map(async (nft) => {
          const client = await storage.getUser(nft.clientId);
          return { ...nft, client };
        })
      );
      
      res.json({ ...user, nfts: nftsWithClients });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      res.json({
        totalEarned: 2450.50,
        totalSpent: 0,
        activeContracts: 3,
        completedJobs: 12,
        reputationScore: 95,
        rating: 4.8,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/jobs/:jobId/ai-match", async (req, res) => {
    try {
      const { jobId } = req.params;
      const { freelancerSkills, nfts } = req.body;
      
      const allJobs = await storage.getJobs({ status: "open" });
      const matches = await matchJobsToFreelancer(
        freelancerSkills,
        nfts,
        allJobs.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          skills: job.skills,
          category: job.category,
        }))
      );
      
      res.json({ matches });
    } catch (error) {
      console.error("Error AI matching:", error);
      res.status(500).json({ error: "Failed to perform AI matching" });
    }
  });

  // SideShift API Routes
  app.get("/api/sideshift/coins", async (req, res) => {
    try {
      const coins = await getAvailableCoins();
      res.json({ coins });
    } catch (error) {
      console.error("Error fetching coins:", error);
      res.status(500).json({ error: "Failed to fetch available coins" });
    }
  });

  app.get("/api/sideshift/quote", async (req, res) => {
    try {
      const { depositCoin, settleCoin, depositAmount, settleAmount } = req.query;
      
      if (!depositCoin || !settleCoin) {
        return res.status(400).json({ error: "depositCoin and settleCoin are required" });
      }

      const quote = await getQuote(
        depositCoin as string,
        settleCoin as string,
        depositAmount as string | undefined,
        settleAmount as string | undefined
      );

      if (!quote) {
        return res.status(404).json({ error: "Quote not available" });
      }

      res.json(quote);
    } catch (error) {
      console.error("Error getting quote:", error);
      res.status(500).json({ error: "Failed to get quote" });
    }
  });

  app.post("/api/sideshift/shift", async (req, res) => {
    try {
      const { quoteId, settleAddress, affiliateId } = req.body;

      if (!quoteId || !settleAddress) {
        return res.status(400).json({ error: "quoteId and settleAddress are required" });
      }

      const shift = await createFixedShift(quoteId, settleAddress, affiliateId);

      if (!shift) {
        return res.status(500).json({ error: "Failed to create shift" });
      }

      res.json(shift);
    } catch (error) {
      console.error("Error creating shift:", error);
      res.status(500).json({ error: "Failed to create shift" });
    }
  });

  app.get("/api/sideshift/shift/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const shift = await getShiftStatus(id);

      if (!shift) {
        return res.status(404).json({ error: "Shift not found" });
      }

      res.json(shift);
    } catch (error) {
      console.error("Error getting shift status:", error);
      res.status(500).json({ error: "Failed to get shift status" });
    }
  });

  app.post("/api/sideshift/convert", async (req, res) => {
    try {
      const { fromCoin, amount, toCoin = "USDC" } = req.body;

      if (!fromCoin || !amount) {
        return res.status(400).json({ error: "fromCoin and amount are required" });
      }

      const conversion = await convertToBaseCurrency(fromCoin, amount, toCoin);

      if (!conversion) {
        return res.status(500).json({ error: "Failed to convert currency" });
      }

      res.json(conversion);
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ error: "Failed to convert currency" });
    }
  });

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          const savedMessage = await storage.createMessage({
            jobId: message.jobId,
            senderId: message.senderId,
            content: message.content,
          });
          
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                data: savedMessage,
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
