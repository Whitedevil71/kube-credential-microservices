import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './utils/db';
import verificationRoutes from './routes/verificationRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', verificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Verification Service running on port ${PORT}`);
      console.log(`Worker ID: ${process.env.WORKER_ID || 'worker-1'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
