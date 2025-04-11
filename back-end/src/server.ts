import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import configuration
import { SERVER_PORT, SERVER_HOST, API_BASE_PATHS } from './config/index.js'; // Use index.js

// Import database functions
import { connectDB, initializeData, disconnectDB } from './services/database.js';

// Import routers
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js'
import uploadRouter from './routes/upload.js';

const app: Express = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Request Logging Middleware ---
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API Routes ---
app.use(API_BASE_PATHS.AUTH, authRouter);
app.use(API_BASE_PATHS.POSTS, postsRouter);
app.use(API_BASE_PATHS.USERS, usersRouter);
app.use('/', uploadRouter)

// --- Not Found Handler ---
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: `Not Found - ${req.method} ${req.originalUrl}` });
});

// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack || err);
  const statusCode = (err as any).status || 500;
  res.status(statusCode).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
  });
});

// --- Start Server Function ---
const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'production' || process.env.SEED_DB === 'true') { // Allow seeding via env var
        await initializeData();
    }
    const server = app.listen(SERVER_PORT, () => {
      console.log(`Server running on http://${SERVER_HOST}:${SERVER_PORT}`);
    });

    // Graceful Shutdown Handling
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach((signal) => {
        process.on(signal, async () => { /* ... shutdown logic ... */ });
     });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();