import prisma from "../../prismaClient.js";

const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }

    // Optional: Check if folder has subfolders or files
    const hasChildren = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        subfolders: true,
        files: true,
      },
    });

    if (!hasChildren) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (hasChildren.subfolders.length > 0 || hasChildren.files.length > 0) {
      return res.status(400).json({ 
        message: "Folder contains files or subfolders. Delete them first or implement recursive deletion." 
      });
    }

    // Proceed with deletion
    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Failed to delete folder", error: error.message });
  }
};

export default deleteFolder;
