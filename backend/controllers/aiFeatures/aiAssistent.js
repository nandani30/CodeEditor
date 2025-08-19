import prisma from "../../prismaClient.js";
import axios from "axios";
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

const MODEL = "deepseek/deepseek-r1-distill-qwen-14b";
const MAX_TOKENS = 32000;      // model max
const SAFE_TOKENS = 28000;     // safety buffer

// init lightweight tokenizer
const encoder = new Tiktoken(cl100k_base);

// count tokens
function countTokens(text) {
  return encoder.encode(text).length;
}

// classify request type
function classifyPrompt(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes("error") || lower.includes("bug") || lower.includes("crash")) return "error";
  if (lower.includes("add") || lower.includes("implement") || lower.includes("change")) return "feature";
  return "project";
}

export const handleAIRequest = async (req, res) => {
  const { projectId } = req.params;
  const { prompt, userId } = req.body;

  if (!prompt) return res.status(400).json({ message: "Prompt required" });

  try {
    // 1. Save user message
    const userMessage = await prisma.aIMessage.create({
      data: {
        sender: "user",
        content: prompt,
        projectId,
        userId,
      },
    });

    // 2. Classify + fetch related files
    const category = classifyPrompt(prompt);

    let filesToSend = [];
    if (category === "error") {
      filesToSend = await prisma.file.findMany({ where: { projectId }, take: 3 });
    } else if (category === "feature") {
      filesToSend = await prisma.file.findMany({ where: { projectId }, take: 5 });
    } else {
      filesToSend = await prisma.file.findMany({ where: { projectId }, take: 10 });
    }

    // 3. Build context with token budget
    let context = "";
    let usedTokens = countTokens(prompt);

    for (const file of filesToSend) {
      const fileHeader = `\n\n--- FILE: ${file.name} ---\n`;
      const fileContent = fileHeader + file.content;
      const fileTokens = countTokens(fileContent);

      if (usedTokens + fileTokens > SAFE_TOKENS) break;
      context += fileContent;
      usedTokens += fileTokens;
    }

    // Final safeguard (truncate if still too large)
    if (usedTokens > SAFE_TOKENS) {
      context = context.slice(0, Math.floor(context.length * 0.8)); // keep 80%
    }

    // 4. Send to OpenRouter
    let aiReply = "⚠️ AI could not generate a response at this time.";

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: MODEL,
          messages: [
            { role: "system", content: "You are an expert AI coding assistant." },
            { role: "user", content: `${prompt}\n\nContext:\n${context}` },
          ],
          max_tokens: MAX_TOKENS - usedTokens, // ensure within budget
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      aiReply = response.data.choices?.[0]?.message?.content || aiReply;
    } catch (apiErr) {
      console.error("OpenRouter API Error:", apiErr.response?.data || apiErr.message);
    }

    // 5. Save AI response
    const aiMessage = await prisma.aIMessage.create({
      data: {
        sender: "ai",
        content: aiReply,
        projectId,
      },
    });

    res.json({ success: true, messages: [userMessage, aiMessage] });
  } catch (err) {
    console.error("AI Request Error:", err.message);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
};
