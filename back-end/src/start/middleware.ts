import helmet from 'helmet';
import compression from 'compression';
import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';

const frontURL = process.env.FRONT_URL;

export default (app: Express) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.26.53:5173',
    frontURL!,
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  app.options('*', cors());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(helmet());
  app.use(compression());
};
