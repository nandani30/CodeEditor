import prisma from "../../prismaClient.js";
import crypto from "crypto";

function fp(obj) {
  const s = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash("sha256").update(s).digest("hex");
}

export const createFlashcard = async (req, res) => {
  const { projectId } = req.params;
  const { userId, title, topic, content, category, challenge } = req.body;

  if (!title || !topic || !content || !category || !challenge) {
    return res.status(400).json({ message: "title, topic, content, category, challenge required" });
  }

  try {
    const flashcard = await prisma.flashcard.create({
      data: {
        projectId,
        userId,
        title,
        topic,
        content,
        category,
      },
    });

    const toCreate = [];

    if (category === "DSA") {
      const problems = Array.isArray(challenge?.problems) ? challenge.problems : [];
      for (const p of problems) {
        const data = {
          description: p.description,
          boilerplate: {
            javascript: p.boilerplate?.javascript || "",
            python: p.boilerplate?.python || "",
            cpp: p.boilerplate?.cpp || "",
            java: p.boilerplate?.java || "",
          },
          testCases: p.testCases,
        };

        const fingerprint = fp({
          type: "coding",
          title: p.title.trim(),
          description: p.description,
          tests: p.testCases?.map(t => ({ i: t.input, o: t.output })),
        });

        toCreate.push({
          userId,
          flashcardId: flashcard.id,
          title: p.title.trim(),
          type: "coding",
          difficulty: (p.difficulty || "MEDIUM"),
          data,
          fingerprint,
        });
      }
    } else if (category === "CONCEPTUAL") {
      const quiz = { questions: challenge?.questions || [] };
      if (!quiz.questions.length) {
        return res.status(400).json({ message: "Quiz questions missing" });
      }

      const fingerprint = fp({
        type: "quiz",
        topic,
        q: quiz.questions.map(q => ({ q: q.question, a: q.answer })),
      });

      toCreate.push({
        userId,
        flashcardId: flashcard.id,
        title: `${topic} — Quiz`,
        type: "quiz",
        difficulty: null,
        data: quiz,
        fingerprint,
      });
    }

    const created = [];
    for (const c of toCreate) {
      try {
        const row = await prisma.challenge.create({ data: c });
        created.push(row);
      } catch (e) {
        if (e.code !== "P2002") {
          throw e;
        }
      }
    }

    res.status(201).json({ flashcard, challenges: created });
  } catch (err) {
    console.error("Create Flashcard Error:", err);
    res.status(500).json({ message: "Failed to create flashcard/challenges" });
  }
};

export const updateFlashcard = async (req, res) => {
  const { id } = req.params;
  const { title, topic, content } = req.body;

  const flashcard = await prisma.flashcard.update({
    where: { id },
    data: { title, topic, content },
  });

  res.json(flashcard);
};

export const deleteFlashcard = async (req, res) => {
  const { id } = req.params;
  await prisma.flashcard.delete({ where: { id } });
  res.status(204).end();
};

export const completeChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const updated = await prisma.challenge.update({
    where: { id: challengeId },
    data: { status: "COMPLETED" },
  });
  res.json(updated);
};
