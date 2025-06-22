import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './utils/db';
import { notFound, errorHandler } from './middlewares/error.middleware';

// Route Imports
import authRoutes from './routes/auth.routes';
import storeRoutes from './routes/store.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || !isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- Deployment ---
if (isProduction) {
  const clientBuildPath = path.join(process.cwd(), 'dist/client');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
// --- End Deployment ---

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
