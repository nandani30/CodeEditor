import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import sanitizeError from "../../utils/sanitizeError.js";

const execAsync = util.promisify(exec);

// Supported languages and their file extensions
const languageConfigs = {
  python: {
    extension: ".py",
    command: (filePath) => `python "${filePath}"`,
  },
  javascript: {
    extension: ".js",
    command: (filePath) => `node "${filePath}"`,
  },
  cpp: {
    extension: ".cpp",
    command: (filePath) => {
      const executable = filePath.replace(/\.cpp$/, ".exe");
      return {
        compile: `g++ "${filePath}" -o "${executable}"`,
        run: `"${executable}"`,
      };
    },
  },
  java: {
    extension: ".java",
    command: (filePath) => {
      const dir = path.dirname(filePath);
      const className = path.basename(filePath, ".java");
      return {
        compile: `javac "${filePath}"`,
        run: `java -cp "${dir}" ${className}`,
      };
    },
  },
};

export default async function runCode({ filePath, language }) {
  const config = languageConfigs[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const start = Date.now();
  const fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    return {
      file: filePath,
      error: "File does not exist",
      executionTime: 0,
    };
  }

  try {
    let output = "";
    if (language === "cpp" || language === "java") {
      const { compile, run } = config.command(filePath);
      await execAsync(compile); // Compile step
      const { stdout } = await execAsync(run); // Run step
      output = stdout;
    } else {
      const command = config.command(filePath);
      const { stdout } = await execAsync(command);
      output = stdout;
    }

    return {
      file: filePath,
      output,
      error: null,
      language,
      executionTime: Date.now() - start,
    };
  } catch (err) {
    return {
      file: filePath,
      output: null,
      error: sanitizeError(err),
      language,
      executionTime: Date.now() - start,
    };
  }
}
