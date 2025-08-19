import axios from "axios";

export const getCodeSuggestion = async (req, res) => {
  const { codeBefore, codeAfter } = req.body;

  if (!codeBefore && !codeAfter) {
    return res.status(400).json({ error: "codeBefore and/or codeAfter required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-distill-qwen-14b",
        messages: [
          {
            role: "system",
            content:
              "You are a code completion assistant. Fill in only where the <CURSOR> token is placed. " +
              "Return ONLY the missing code, nothing else (no explanations).",
          },
          {
            role: "user",
            content: `Code:\n${codeBefore}<CURSOR>${codeAfter}`,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestion = response.data.choices[0].message.content.trim();

    res.json({ suggestion });
  } catch (error) {
    console.error("Error fetching code suggestion:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch code suggestion" });
  }
};
