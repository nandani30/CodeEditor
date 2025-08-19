import axios from "axios";

const MODEL = "deepseek/deepseek-r1-distill-qwen-14b";

function extractJson(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) throw new Error("No JSON in response");
  return JSON.parse(text.slice(first, last + 1));
}

export const generateFlashcardAndChallenge = async (req, res) => {
  const { aiResponse } = req.body;

  if (!aiResponse) return res.status(400).json({ message: "aiResponse required" });

  try {
    const openrouter = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `
You convert an AI explanation into a study flashcard + challenge JSON. 
Rules:
- Detect type:
  • "DSA" if it's data structures/algorithms or a specific coding problem (e.g., Reverse Array, Two Sum).
  • "CONCEPTUAL" for theory (OOP, Promises, JSON, loops, React basics, etc.).
- Produce a concise but complete flashcard summary: target 120–220 words.
- Output STRICT JSON ONLY. Schema:

{
  "title": "short human title",
  "topic": "concise topic",
  "category": "DSA" | "CONCEPTUAL",
  "flashcard": "50-80 word summary",
  "challenge": {
    // DSA:
    "kind": "problem" | "topic",
    "problems": [
      {
        "title": "...",
        "difficulty": "EASY" | "MEDIUM" | "HARD",
        "description": "full problem statement",
        "boilerplate": {
          "javascript": "// function signature",
          "python": "def func(...):",
          "cpp": "void func(...) { }",
          "java": "class Solution { ... }"
        },
        "testCases": [
          { "input": "...", "output": "..." }
          // include normal, edge, large, duplicates/negatives if applicable
          // at least 25–30 diverse cases
        ]
      }
    ],

    // CONCEPTUAL:
    "questions": [
      {
        "question": "...",
        "options": ["A","B","C","D"],
        "answer": "B",
        "explanation": "1 sentence"
      }
      // length = 10
    ]
  }
}
`
          },
          {
            role: "user",
            content: `Create the JSON for this content: ${aiResponse}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const raw = openrouter.data?.choices?.[0]?.message?.content || "";
    const draft = extractJson(raw);

    if (draft.category === "Conceptual") draft.category = "CONCEPTUAL";
    if (draft.category === "DSA") draft.category = "DSA";

    if (draft.category === "CONCEPTUAL" && (!draft.challenge?.questions || draft.challenge.questions.length < 10)) {
      return res.status(502).json({ message: "AI returned fewer than 10 MCQs. Try again." });
    }

    if (draft.category === "DSA") {
      const probs = draft.challenge?.problems || [];
      probs.forEach(p => {
        if (!p.testCases || p.testCases.length < 10) {
          throw new Error(`Insufficient test cases for problem "${p.title}"`);
        }
        if (!p.boilerplate || !p.boilerplate.javascript || !p.boilerplate.python || !p.boilerplate.cpp || !p.boilerplate.java) {
          throw new Error(`Missing boilerplate for problem "${p.title}"`);
        }
      });
    }

    res.json({ success: true, draft });
  } catch (err) {
    console.error("Flashcard Preview Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to generate preview" });
  }
};
