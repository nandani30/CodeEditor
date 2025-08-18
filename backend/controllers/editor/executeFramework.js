// controllers/framework.controller.js
import { exec } from 'child_process';
import path from 'path';
import sanitizeError from '../../utils/sanitizeError.js';

const FRAMEWORK_COMMANDS = {
  react: 'npm start',
  next: 'npm run dev',
  express: 'node server.js',
};

const runFrameworkProject = (req, res) => {
  const { framework, projectPath } = req.body;

  if (!framework || !projectPath) {
    return res.status(400).json({ message: 'Framework and projectPath are required' });
  }

  const command = FRAMEWORK_COMMANDS[framework.toLowerCase()];
  if (!command) {
    return res.status(400).json({ message: `Unsupported framework: ${framework}` });
  }

  const fullPath = path.resolve(projectPath);
  const startTime = Date.now();

  exec(command, { cwd: fullPath }, (error, stdout, stderr) => {
    const execTime = Date.now() - startTime;

    if (error || stderr) {
      return res.status(200).json({
        framework,
        executionTime: `${execTime}ms`,
        output: null,
        error: sanitizeError(stderr || error.message),
      });
    }

    res.status(200).json({
      framework,
      executionTime: `${execTime}ms`,
      output: stdout,
      error: null,
    });
  });
};

export default runFrameworkProject;