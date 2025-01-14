import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { logger } from './middlewares/logger';

import moviesRouter from './routers/movies.js';

import { env } from './utils/env.js';
import authRouter from './routers/auth.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const startServer = () => {
  const app: Express = express();

  app.use(cors());
  // app.use(logger);
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static('uploads'));

  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Welcome to server',
    });
  });

  app.use('/auth', authRouter);
  app.use('/movies', moviesRouter);
  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env('PORT', '3000'));

  app.listen(port, () => console.log(`Server running on ${port} port`));
};
