// controllers/getProjectStructure.js
import prisma from "../../prismaClient.js";

const getProjectStructure = async (req, res) => {
  const { projectId } = req.params;

  try {
    const folders = await prisma.folder.findMany({
      where: { projectId },
      include: {
        subfolders: true,
        files: true,
      },
    });

    // Structure as a tree for frontend
    const rootFolders = folders.filter(folder => !folder.parentFolderId);

    const buildTree = (folder) => ({
      id: folder.id,
      name: folder.name,
      type: 'folder',
      files: folder.files.map(file => ({
        id: file.id,
        name: file.name,
        type: 'file',
      })),
      subfolders: folders
        .filter(f => f.parentFolderId === folder.id)
        .map(buildTree),
    });

    const folderTree = rootFolders.map(buildTree);

    res.json({ success: true, data: folderTree });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error loading project structure" });
  }
};

export default getProjectStructure;