import prisma from "../../prismaClient.js";

// get all chats for a project
export const getProjectChats = async (req, res) => {
  const { projectId } = req.params;

  try {
    const messages = await prisma.aIMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching chats:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch chats" });
  }
};
