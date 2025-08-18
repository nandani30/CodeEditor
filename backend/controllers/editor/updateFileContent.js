import prisma from "../../prismaClient.js";

/**
 * Update the content of a file by ID
 * @route PUT /api/editor/file/:fileId
 */
const updateFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "File content updated.", file: updatedFile });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Failed to update file content", error: error.message });
  }
};

export default updateFileContent;
