import prisma from "../../prismaClient.js";

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ message: "File ID is required" });
    }

    // Delete the file from the database
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file", error: error.message });
  }
};

export default deleteFile;
