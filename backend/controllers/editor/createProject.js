import prisma from "../../prismaClient.js"

// Framework templates with initial file structure
const FRAMEWORK_TEMPLATES = {
  react: {
    folders: [
      { name: "src", parentPath: "" },
      { name: "components", parentPath: "src" },
      { name: "public", parentPath: "" },
    ],
    files: [
      {
        name: "package.json",
        path: "",
        content: JSON.stringify(
          {
            name: "react-app",
            version: "0.1.0",
            private: true,
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "react-scripts": "5.0.1",
              "web-vitals": "^2.1.4",
            },
            scripts: {
              start: "react-scripts start",
              build: "react-scripts build",
              test: "react-scripts test",
              eject: "react-scripts eject",
            },
            eslintConfig: {
              extends: ["react-app", "react-app/jest"],
            },
            browserslist: {
              production: [">0.2%", "not dead", "not op_mini all"],
              development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"],
            },
          },
          null,
          2,
        ),
        extension: "json",
      },
      {
        name: "index.html",
        path: "public",
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using Create React App" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
        extension: "html",
      },
      {
        name: "index.js",
        path: "src",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();`,
        extension: "js",
      },
      {
        name: "App.js",
        path: "src",
        content: `import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo || "/placeholder.svg"} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;`,
        extension: "js",
      },
      {
        name: "App.css",
        path: "src",
        content: `.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`,
        extension: "css",
      },
      {
        name: "index.css",
        path: "src",
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
        extension: "css",
      },
      {
        name: "reportWebVitals.js",
        path: "src",
        content: `const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;`,
        extension: "js",
      },
    ],
  },
  nextjs: {
    folders: [
      { name: "app", parentPath: "" },
      { name: "public", parentPath: "" },
    ],
    files: [
      {
        name: "package.json",
        path: "",
        content: JSON.stringify(
          {
            name: "nextjs-app",
            version: "0.1.0",
            private: true,
            scripts: {
              dev: "next dev",
              build: "next build",
              start: "next start",
              lint: "next lint",
            },
            dependencies: {
              next: "14.0.4",
              react: "^18",
              "react-dom": "^18",
            },
            devDependencies: {
              eslint: "^8",
              "eslint-config-next": "14.0.4",
            },
          },
          null,
          2,
        ),
        extension: "json",
      },
      {
        name: "next.config.js",
        path: "",
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
        extension: "js",
      },
      {
        name: "layout.js",
        path: "app",
        content: `import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
        extension: "js",
      },
      {
        name: "page.js",
        path: "app",
        content: `import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.js</code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:translate-y-1/4 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      </div>
    </main>
  )
}`,
        extension: "js",
      },
      {
        name: "globals.css",
        path: "app",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`,
        extension: "css",
      },
    ],
  },
  expressjs: {
    folders: [
      { name: "routes", parentPath: "" },
      { name: "middleware", parentPath: "" },
      { name: "controllers", parentPath: "" },
    ],
    files: [
      {
        name: "package.json",
        path: "",
        content: JSON.stringify(
          {
            name: "express-app",
            version: "1.0.0",
            description: "Express.js application",
            main: "server.js",
            scripts: {
              start: "node server.js",
              dev: "nodemon server.js",
              test: 'echo "Error: no test specified" && exit 1',
            },
            dependencies: {
              express: "^4.18.2",
              cors: "^2.8.5",
              dotenv: "^16.3.1",
              helmet: "^7.1.0",
              morgan: "^1.10.0",
            },
            devDependencies: {
              nodemon: "^3.0.1",
            },
            keywords: ["express", "node", "api"],
            author: "",
            license: "ISC",
          },
          null,
          2,
        ),
        extension: "json",
      },
      {
        name: "server.js",
        path: "",
        content: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/api'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Express.js!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      api: '/api'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📍 http://localhost:\${PORT}\`);
});`,
        extension: "js",
      },
      {
        name: "api.js",
        path: "routes",
        content: `const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Sample API endpoint
router.get('/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

// POST example
router.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  res.status(201).json({
    message: 'User created successfully',
    user: { id: Date.now(), name, email }
  });
});

module.exports = router;`,
        extension: "js",
      },
      {
        name: ".env.example",
        path: "",
        content: `# Server Configuration
PORT=3000
NODE_ENV=development

# Database (if needed)
# DATABASE_URL=your_database_url_here

# JWT Secret (if using authentication)
# JWT_SECRET=your_jwt_secret_here

# API Keys (if needed)
# API_KEY=your_api_key_here`,
        extension: "example",
      },
    ],
  },
}

const createProject = async (req, res) => {
  try {
    const { name, description, framework, language } = req.body
    const userId = req.user.id

    if (!name) {
      return res.status(400).json({ message: "Project name is required" })
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        ownerId: userId,
      },
    })

    // If framework is specified, create template structure
    if (framework && FRAMEWORK_TEMPLATES[framework.toLowerCase()]) {
      const template = FRAMEWORK_TEMPLATES[framework.toLowerCase()]
      const folderMap = new Map() // To track created folders by path

      // Create folders first
      for (const folderDef of template.folders) {
        const parentFolder = folderDef.parentPath ? folderMap.get(folderDef.parentPath) : null

        const folder = await prisma.folder.create({
          data: {
            name: folderDef.name,
            projectId: project.id,
            parentFolderId: parentFolder?.id || null,
          },
        })

        // Store folder with its path for reference
        const fullPath = folderDef.parentPath ? `${folderDef.parentPath}/${folderDef.name}` : folderDef.name
        folderMap.set(fullPath, folder)
      }

      // Create files
      for (const fileDef of template.files) {
        const folder = fileDef.path ? folderMap.get(fileDef.path) : null

        await prisma.file.create({
          data: {
            name: fileDef.name,
            content: fileDef.content,
            extension: fileDef.extension,
            projectId: project.id,
            folderId: folder?.id || null,
          },
        })
      }
    } else if (language && !framework) {
      // Create a simple file for single language projects
      const languageExtensions = {
        python: { ext: "py", content: "# Welcome to Python!\nprint('Hello, World!')" },
        javascript: { ext: "js", content: "// Welcome to JavaScript!\nconsole.log('Hello, World!');" },
        cpp: {
          ext: "cpp",
          content:
            '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
        },
        java: {
          ext: "java",
          content:
            'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        },
      }

      const langConfig = languageExtensions[language.toLowerCase()]
      if (langConfig) {
        await prisma.file.create({
          data: {
            name: language.toLowerCase() === "java" ? "Main.java" : `main.${langConfig.ext}`,
            content: langConfig.content,
            extension: langConfig.ext,
            projectId: project.id,
          },
        })
      }
    }

    res.status(201).json({
      success: true,
      project,
      message: `Project created successfully${framework ? ` with ${framework} template` : ""}!`,
    })
  } catch (error) {
    console.error("Error creating project:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    })
  }
}

export default createProject
