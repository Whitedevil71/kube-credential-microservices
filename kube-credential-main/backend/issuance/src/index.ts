import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './utils/db';
import issuanceRoutes from './routes/issuanceRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Load .env from service root regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// CORS: allow Vercel frontend and local dev
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'https://kube-credential-chi-pied.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', issuanceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Issuance Service running on port ${PORT}`);
      console.log(`Worker ID: ${process.env.WORKER_ID || 'worker-1'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
