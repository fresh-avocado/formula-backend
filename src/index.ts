import express, { Express, Request, Response } from 'express';

import loggerService from './services/logger';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGOOSE_OPTIONS } from './utils/constants/mongoose';
import constructorController from './controllers/constructor/constructorController';
import config from './services/config';
import raceController from './controllers/race/raceController';
import driverController from './controllers/driver/driverController';

const logger = loggerService.child({ module: 'index.ts' });

const api: Express = express();

const port = config.get<number>('PORT');
const mongoConnStr = config.get<string>('MONGO_CONN_STR');
const nodeEnv = config.get<string>('NODE_ENV');

api.use(express.json({ limit: '100kb' }));
api.use(
  cors({
    origin: nodeEnv === 'production' ? '<PROD DOMAIN>' : 'http://localhost:3000',
  }),
);

api.get('/ping', (req: Request, res: Response) => {
  return res.status(200).send('pong');
});

api.use('/v1/constructors', constructorController);
api.use('/v1/races', raceController);
api.use('/v1/drivers', driverController);

mongoose.connect(mongoConnStr, MONGOOSE_OPTIONS).then(async () => {
  logger.info('connection to mongo established!');
  api.listen(port, () => {
    logger.info(`server is running at http://localhost:${port}`);
  });
}).catch((err: Error) => {
  logger.error(`error connecting to mongoose: ${err.message}`);
});

