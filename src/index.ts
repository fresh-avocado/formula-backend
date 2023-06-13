import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import loggerService from './services/logger';

const logger = loggerService.child({ module: 'index.ts' });

dotenv.config({ path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev') });

const port = process.env.PORT as string;
const api: Express = express();

api.use(helmet());
api.use(express.json({ limit: '100kb' }));

api.get('/', (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

api.listen(port, () => {
  logger.info(`server is running at http://localhost:${port}`);
});
