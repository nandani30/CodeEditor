import prisma from '../../prismaClient.js'

const getProjectInfo = async (req, res) => {
    const { projectId } = req.params; // Get the project ID from params
  
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          files: true,         // List of files in the project
          folders: true,       // List of folders in the project
          aiMessages: true,    // AI chat history
          sessions: true,      // Collaborative sessions (if applicable)
        }
      });
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const projectInfo = {
        projectId: project.id,
        name: project.name,
        description: project.description || "No description available",
        files: project.files,
        folders: project.folders,
        aiMessages: project.aiMessages,
        sessions: project.sessions, // Optional, if you need to show collaborative sessions
      };
  
      res.json({ projectInfo });
    } catch (error) {
      console.error("Error fetching project info:", error);
      res.status(500).json({ message: "Error fetching project data", error: error.message });
    }
  };
  
  export default getProjectInfo;
  