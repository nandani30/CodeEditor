import prisma from "../../prismaClient.js";

export const startSession = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is owner
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Only project owner can start session" });
    }

    // Mark project as active collaboration session
    await prisma.project.update({
      where: { id: projectId },
      data: { isCollaborating: true }
    });

    res.json({ message: "Collaboration session started" });
  } catch (error) {
    res.status(500).json({ message: "Error starting session", error: error.message });
  }
};

export const stopSession = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Only project owner can stop session" });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { isCollaborating: false }
    });

    res.json({ message: "Collaboration session stopped" });
  } catch (error) {
    res.status(500).json({ message: "Error stopping session", error: error.message });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { projectId, collaboratorId } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Only project owner can remove collaborators" });
    }

    await prisma.collaboration.deleteMany({
      where: { projectId, userId: collaboratorId }
    });

    res.json({ message: "Collaborator removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing collaborator", error: error.message });
  }
};
