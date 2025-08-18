import prisma from "../../prismaClient.js";

const createFolder = async (req, res) => {
  const { projectId, parentFolderId, name } = req.body;

  if (!projectId || !name) {
    return res.status(400).json({ message: "projectId and folder name are required" });
  }

  try {
    const newFolder = await prisma.folder.create({
      data: {
        name,
        project: {
          connect: { id: projectId }
        },
        parentFolder: parentFolderId ? { connect: { id: parentFolderId } } : undefined
      },
      select: {
        id: true,
        name: true,
        projectId: true,
        parentFolderId: true,
        createdAt: true
      }
    });

    res.status(201).json({ success: true, folder: newFolder });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

export default createFolder;
