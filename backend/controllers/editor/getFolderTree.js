import prisma from "../../prismaClient.js";

// /**
//  * GET full folder + file tree of a project
//  * Params: projectId (from req.query or req.params)
//  */
const getFolderTree = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    // Fetch folders for the project
    const folders = await prisma.folder.findMany({
      where: { projectId },
      include: {
        subfolders: true,
        files: true,
      },
    });

    res.json({ folders });
  } catch (error) {
    console.error("Error fetching folder tree:", error.message);
    res.status(500).json({ message: "Failed to fetch folder tree" });
  }
};

export default getFolderTree;
