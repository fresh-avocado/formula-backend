import express, { Express, Request, Response } from 'express';

import loggerService from './services/logger';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGOOSE_OPTIONS } from './utils/constants/mongoose';
import constructorController from './controllers/constructorController';
import config from './services/config';

const logger = loggerService.child({ module: 'index.ts' });

const api: Express = express();

api.use(express.json({ limit: '100kb' }));
api.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'prod domain' : 'http://localhost:3000',
  }),
);

api.get('/ping', (req: Request, res: Response) => {
  return res.status(200).send('pong');
});

api.use('/v1', constructorController);

const port = config.get<number>('PORT');
const mongoConnStr = config.get<string>('MONGO_CONN_STR');

mongoose.connect(mongoConnStr, MONGOOSE_OPTIONS).then(async () => {
  logger.info('connection to mongo established!');
  api.listen(port, () => {
    logger.info(`server is running at http://localhost:${port}`);
  });
}).catch((err: Error) => {
  logger.error(`error connecting to mongoose: ${err.message}`);
});

