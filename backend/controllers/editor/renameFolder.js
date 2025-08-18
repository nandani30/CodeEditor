// controllers/editor/renameFolder.js
import prisma from '../../prismaClient.js';

const renameFolder = async (req, res) => {
  try {
    const { folderId, newName } = req.body;

    if (!folderId || !newName) {
      return res.status(400).json({ message: "Folder ID and new name are required" });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: { name: newName },
    });

    res.status(200).json({ message: "Folder renamed successfully", folder: updatedFolder });
  } catch (error) {
    res.status(500).json({ message: "Error renaming folder", error: error.message });
  }
};

export default renameFolder;
