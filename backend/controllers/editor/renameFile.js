// controllers/editor/renameFile.js
import prisma from '../../prismaClient.js';

const renameFile = async (req, res) => {
  try {
    const { fileId, newName } = req.body;

    if (!fileId || !newName) {
      return res.status(400).json({ message: "File ID and new name are required" });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: { name: newName },
    });

    res.status(200).json({ message: "File renamed successfully", file: updatedFile });
  } catch (error) {
    res.status(500).json({ message: "Error renaming file", error: error.message });
  }
};

export default renameFile;
