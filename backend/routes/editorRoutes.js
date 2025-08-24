import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

// Import controllers
import createFile from '../controllers/editor/createFile.js';
import createFolder from '../controllers/editor/createFolder.js';
import getFileContent from '../controllers/editor/getFileContent.js';
import updateFileContent from '../controllers/editor/updateFileContent.js';
import getFolderTree from '../controllers/editor/getFolderTree.js';
import deleteFile from '../controllers/editor/deleteFile.js';
import deleteFolder from '../controllers/editor/deleteFolder.js';
import renameFile from '../controllers/editor/renameFile.js';
import renameFolder from '../controllers/editor/renameFolder.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// File routes
router.post('/file', createFile);
router.get('/file/:fileId', getFileContent);
router.put('/file/:fileId', updateFileContent);
router.delete('/file/:fileId', deleteFile);
router.patch('/file/:fileId/rename', renameFile);

// Folder routes
router.post('/folder', createFolder);
router.get('/folder/:projectId', getFolderTree);
router.delete('/folder/:folderId', deleteFolder);
router.patch('/folder/:folderId/rename', renameFolder);
export default router;
