import fetch from "node-fetch";

export const analyzeCodeQuality = async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-qwen-14b",
        messages: [
          {
            role: "system",
            content: `You are a strict code quality analyzer.
Return ONLY valid JSON with this structure:
{
  "scores": {
    "readability": <number 0-100>,
    "maintainability": <number 0-100>,
    "performance": <number 0-100>,
    "security": <number 0-100>
  },
  "issues": [
    { "type": "Error"|"Warning"|"Info", "message": "short message" }
  ]
}`
          },
          {
            role: "user",
            content: `Analyze the following code:\n\n${code}`
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // fallback if model output isn't clean JSON
      parsed = {
        scores: { readability: 0, maintainability: 0, performance: 0, security: 0 },
        issues: [{ type: "Error", message: "Failed to parse model output" }]
      };
    }

    res.json(parsed);
  } catch (err) {
    console.error("Error analyzing code quality:", err);
    res.status(500).json({ error: "Failed to analyze code quality" });
  }
};
