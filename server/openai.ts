import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function matchJobsToFreelancer(
  freelancerSkills: string[],
  freelancerNfts: Array<{ jobTitle: string; rating: number }>,
  availableJobs: Array<{ id: string; title: string; description: string; skills: string[]; category: string }>
): Promise<{ jobId: string; score: number; reason: string }[]> {
  if (!openai) {
    return [];
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are an AI job matching expert for a freelance marketplace. Analyze freelancer skills and work history to recommend the best job matches. Respond with JSON in this format: { 'matches': [{ 'jobId': string, 'score': number (0-100), 'reason': string }] }",
        },
        {
          role: "user",
          content: `Freelancer Profile:
Skills: ${freelancerSkills.join(", ")}
Past Work: ${freelancerNfts.map(nft => `${nft.jobTitle} (${nft.rating}/5 rating)`).join("; ")}

Available Jobs:
${availableJobs.map((job, i) => `${i + 1}. ID: ${job.id}, Title: ${job.title}, Category: ${job.category}, Required Skills: ${job.skills.join(", ")}`).join("\n")}

Recommend the top 5 best matches with scores and reasons.`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.matches || [];
  } catch (error) {
    console.error("AI job matching error:", error);
    return [];
  }
}

export async function resolveDispute(
  disputeDetails: {
    jobTitle: string;
    clientEvidence: string;
    freelancerEvidence?: string;
    reason: string;
  }
): Promise<{ recommendation: "client" | "freelancer"; reasoning: string; confidence: number }> {
  if (!openai) {
    return {
      recommendation: "client",
      reasoning: "AI disabled",
      confidence: 0,
    };
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are an impartial AI dispute resolver for a freelance marketplace. Analyze evidence from both parties and provide a fair recommendation. Respond with JSON in this format: { 'recommendation': 'client' or 'freelancer', 'reasoning': string, 'confidence': number (0-1) }",
        },
        {
          role: "user",
          content: `Dispute for Job: ${disputeDetails.jobTitle}

Dispute Reason: ${disputeDetails.reason}

Client's Evidence:
${disputeDetails.clientEvidence}

${disputeDetails.freelancerEvidence ? `Freelancer's Evidence:\n${disputeDetails.freelancerEvidence}` : "Freelancer has not provided evidence yet."}

Based on the evidence, who should win this dispute?`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      recommendation: result.recommendation || "client",
      reasoning: result.reasoning || "Unable to determine",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    console.error("AI dispute resolution error:", error);
    return {
      recommendation: "client",
      reasoning: "AI analysis unavailable",
      confidence: 0,
    };
  }
}
