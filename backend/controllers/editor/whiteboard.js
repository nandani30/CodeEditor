import prisma from "../../prismaClient.js";

// Get whiteboard for a project
export const getWhiteboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const whiteboard = await prisma.whiteboard.findUnique({
      where: { projectId: parseInt(projectId) },
    });

    if (!whiteboard) {
      return res.json({ data: null }); // return empty if no whiteboard yet
    }

    res.json(whiteboard);
  } catch (error) {
    console.error("Error fetching whiteboard:", error);
    res.status(500).json({ error: "Failed to fetch whiteboard" });
  }
};

// Save / Update whiteboard
export const saveWhiteboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { data } = req.body; // Excalidraw JSON

    const whiteboard = await prisma.whiteboard.upsert({
      where: { projectId: parseInt(projectId) },
      update: { data },
      create: { projectId: parseInt(projectId), data },
    });

    res.json({ success: true, whiteboard });
  } catch (error) {
    console.error("Error saving whiteboard:", error);
    res.status(500).json({ error: "Failed to save whiteboard" });
  }
};
