import dotenv from "dotenv"
import express from 'express';
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"

import { collabSocket } from "./sockets/collabSocket.js";
import startOtpCleanupJob from "./utils/otpCleanup.js";
import editorRoutes from './routes/editorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import executionRoutes from './routes/executionRoutes.js';
import aiRoutes from './routes/aiRoutes.js'
import challengeAttemptRoutes from './routes/challengeRoutes.js';
import whiteboardRoutes from './routes/whiteboardRoutes.js';
import collabRoutes from './routes/collabRoutes.js';

dotenv.config()
const app = express()
const server = createServer(app);

app.use(cors());
startOtpCleanupJob();

app.use(express.json())
app.use('/api/editor', editorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/challenges', challengeAttemptRoutes);
app.use("/api/projects", whiteboardRoutes);
app.use("/api/collab", collabRoutes);

const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
})

collabSocket(io);


const startServer = async () => {
    try {
      server.listen(process.env.PORT || 7000, () => {
        console.log(`Server is listening on port ${process.env.PORT || 7000}`)
      })
    } catch (error) {
      console.error("Failed to start server:", error)
      process.exit(1)
    }
}

startServer()
