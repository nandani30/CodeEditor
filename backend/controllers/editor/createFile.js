import prisma from "../../prismaClient.js";

const createFile = async (req, res) => {
  const { projectId, folderId, name, content = "", extension} = req.body;

  if (!projectId || !name) {
    return res.status(400).json({ message: "projectId and file name are required" });
  }

  try {
    const newFile = await prisma.file.create({
      data: {
        name,
        content,
        extension,
        project: {
          connect: { id: projectId }
        },
        folder: folderId ? { connect: { id: folderId } } : undefined
      },
      select: {
        id: true,
        name: true,
        content: true,
        extension: true,
        createdAt: true,
        folderId: true,
        projectId: true
      }
    });

    res.status(201).json({ success: true, file: newFile });
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json({ message: "Failed to create file" });
  }
};

export default createFile;
