import prisma from "../../prismaClient.js";
import axios from "axios";

// Judge0 language mapping
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// 🔹 Utility: Pick default language based on user projects
async function getUserDefaultLanguage(userId) {
  try {
    const project = await prisma.project.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { language: true },
    });
    return project?.language || "javascript"; // fallback default
  } catch (err) {
    console.error("Error fetching user default language:", err);
    return "javascript";
  }
}

// GET challenge details by ID
export const getChallengeDetails = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.id; // assuming auth middleware sets req.user

    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId) },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        boilerplate: true, // JSON with all langs
        testCases: true,
      },
    });

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const defaultLanguage = userId
      ? await getUserDefaultLanguage(userId)
      : "javascript";

    res.json({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      boilerplates: challenge.boilerplate,
      languages: Object.keys(challenge.boilerplate), // ["python","js","java","cpp"]
      defaultLanguage,
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ error: "Failed to fetch challenge details" });
  }
};

// Run user code using Judge0
async function runCode(code, language, testCases) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error("Unsupported language");

  const results = [];

  for (const tc of testCases) {
    const resp = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id: languageId,
        stdin: tc.input,
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        params: { base64_encoded: false, wait: true },
      }
    );

    results.push({
      input: tc.input,
      expected: tc.output,
      output: resp.data.stdout?.trim() || "",
      passed: (resp.data.stdout?.trim() || "") === tc.output.trim(),
    });
  }

  return results;
}

// Submit coding challenge
export const submitCodingChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const { language, code } = req.body;

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId) },
      select: {
        id: true,
        boilerplate: true,
        testCases: true,
        submissions: true,
      },
    });

    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    if (!challenge.testCases || !challenge.boilerplate) {
      return res.status(400).json({ message: "Challenge data malformed" });
    }

    // Run the code
    const results = await runCode(code, language, challenge.testCases);

    // Save submission history
    const submissions = challenge.submissions || [];
    submissions.push({ language, code, results, timestamp: new Date() });

    const allPassed = results.every(r => r.passed);

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        submissions,
        status: allPassed ? "COMPLETED" : "PENDING",
      },
    });

    res.json({ results, completed: allPassed });
  } catch (err) {
    console.error("Submit Coding Error:", err);
    res.status(500).json({ message: "Error submitting challenge", error: err.message });
  }
};

// Submit quiz challenge
export const submitQuizChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const { answers } = req.body;

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(challengeId) },
      select: {
        id: true,
        questions: true,
        submissions: true,
      },
    });

    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    if (!challenge.questions) return res.status(400).json({ message: "Quiz data malformed" });

    const submissions = challenge.submissions || [];
    let correctCount = 0;

    const results = answers.map((a, i) => {
      const question = challenge.questions[i];
      const correct = question.answer === a.answer;
      if (correct) correctCount++;
      return {
        questionIndex: i,
        correct,
        submitted: a.answer,
        expected: question.answer,
      };
    });

    submissions.push({ answers, results, timestamp: new Date() });
    const completed = correctCount === challenge.questions.length;

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        submissions,
        status: completed ? "COMPLETED" : "PENDING",
      },
    });

    res.json({ results, completed });
  } catch (err) {
    console.error("Submit Quiz Error:", err);
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
};
