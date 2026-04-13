import express, { Express, NextFunction, Request, Response } from 'express';
import noteTakingRoutes from './routes/index.route';
import connectDatabase from './config/db';
// import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(express.json());

// Routes
app.use('/api', noteTakingRoutes);

//database connection
connectDatabase();

// Global error handler (should be after routes)
// app.use(errorHandler);

export default app;
