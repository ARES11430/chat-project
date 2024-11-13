import helmet from 'helmet';
import compression from 'compression';
import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';

const frontURL = process.env.FRONT_URL;

export default (app: Express) => {
  const allowedOrigins = [
    'http://localhost:4173',
    'http://localhost:5173',
    'http://localhost:80',
    'http://localhost',
    'http://192.168.26.53:4173',
    'http://192.168.26.53:5173',
    'http://192.168.26.53:80',
    'http://192.168.26.53',
    frontURL!,
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.options('*', cors());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(helmet());
  app.use(compression());
};
