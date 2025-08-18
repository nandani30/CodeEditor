import prisma from "../../prismaClient.js";

const getFileContent = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        name: true,
        content: true,
        extension: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ success: true, file });
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ message: "Server error while fetching file content" });
  }
};

export default getFileContent;
