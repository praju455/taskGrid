import { db } from "./db";
import { users, jobs, applications } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const clientUser = await db.insert(users).values({
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595E8f301",
    username: "cryptoentrepreneur",
    bio: "Building the next generation of Web3 applications",
    avatar: "",
    skills: ["Product Management", "Web3", "Blockchain"],
    reputationScore: 88,
    totalEarned: "0",
    totalSpent: "4500.00",
    completedJobs: 8,
    rating: "4.6",
  }).returning();

  const freelancer1 = await db.insert(users).values({
    walletAddress: "0x8B3C5f2a1d9e4F7b8A6c3D2e1f0B9A8C7D6E5F4A",
    username: "alexweb3",
    bio: "Full-stack developer specializing in Web3 and blockchain applications. 5 years of experience building decentralized platforms.",
    avatar: "",
    skills: ["React", "TypeScript", "Solidity", "Node.js", "Web3.js", "UI/UX Design"],
    reputationScore: 95,
    totalEarned: "12450.50",
    totalSpent: "0",
    completedJobs: 24,
    rating: "4.9",
  }).returning();

  const freelancer2 = await db.insert(users).values({
    walletAddress: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B",
    username: "designpro",
    bio: "Creative designer focused on stunning UI/UX for Web3 projects",
    avatar: "",
    skills: ["Figma", "UI Design", "UX Design", "Branding", "Illustration"],
    reputationScore: 92,
    totalEarned: "8750.00",
    totalSpent: "0",
    completedJobs: 18,
    rating: "4.8",
  }).returning();

  await db.insert(jobs).values([
    {
      clientId: clientUser[0].id,
      title: "Build a Landing Page for DeFi Protocol",
      description: "We need a modern, responsive landing page for our new DeFi protocol. The design should be clean, professional, and showcase our key features. Must include wallet connect integration and work seamlessly on mobile devices.",
      category: "Development",
      budget: "500.00",
      currency: "USDC",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      skills: ["React", "TypeScript", "Web3.js", "Tailwind CSS"],
      status: "open",
      escrowFunded: false,
    },
    {
      clientId: clientUser[0].id,
      title: "Design Mobile App UI for NFT Marketplace",
      description: "Looking for a talented designer to create a complete mobile app UI for our NFT marketplace. Should include screens for browsing, buying, selling, and managing NFT collections. Modern, clean aesthetic required.",
      category: "Design",
      budget: "800.00",
      currency: "USDC",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      skills: ["Figma", "UI Design", "Mobile Design", "NFT"],
      status: "open",
      escrowFunded: true,
    },
    {
      clientId: clientUser[0].id,
      title: "Smart Contract Audit for Token Launch",
      description: "Need experienced Solidity developer to audit our ERC-20 token smart contract before mainnet deployment. Must check for security vulnerabilities, gas optimizations, and best practices.",
      category: "Development",
      budget: "1200.00",
      currency: "USDC",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      skills: ["Solidity", "Security", "Smart Contracts", "Ethereum"],
      status: "open",
      escrowFunded: true,
    },
    {
      clientId: clientUser[0].id,
      title: "Write Technical Documentation for API",
      description: "Create comprehensive technical documentation for our blockchain API. Should include getting started guide, endpoint references, code examples, and best practices. Clear and developer-friendly writing required.",
      category: "Writing",
      budget: "350.00",
      currency: "USDC",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      skills: ["Technical Writing", "API Documentation", "Markdown"],
      status: "open",
      escrowFunded: false,
    },
    {
      clientId: clientUser[0].id,
      title: "Create Explainer Video for DApp",
      description: "Need a 60-90 second animated explainer video that shows how our decentralized application works. Should be engaging, clear, and suitable for social media marketing.",
      category: "Video & Animation",
      budget: "600.00",
      currency: "MATIC",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      skills: ["Video Production", "Animation", "Motion Graphics"],
      status: "open",
      escrowFunded: false,
    },
  ]);

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
