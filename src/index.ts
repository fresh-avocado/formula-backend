import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import loggerService from './services/logger';
import cors from 'cors';
import ConstructorSearch from './services/constructorSearch';
import mongoose from 'mongoose';
import { MONGOOSE_OPTIONS } from './utils/constants/mongoose';
import { Constructor, ConstructorModel } from './models/Constructor';
import { readCSV } from './utils/functions/readCSV';

const logger = loggerService.child({ module: 'index.ts' });

dotenv.config({ path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev') });

const port = process.env.PORT as string;
const api: Express = express();

// constructors.csv -> lista de constructores para el search bar
// races.csv -> filtrar las carreras del 2010-2020 y 'joinearlas' por año
// qualifying.csv -> por cada carrera me da la posición de cada constructor

api.use(express.json({ limit: '100kb' }));
api.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'prod domain' : 'http://localhost:3000',
  }),
);

api.get('/ping', (req: Request, res: Response) => {
  return res.status(200).send('pong');
});

api.get('/constructors', (req: Request, res: Response) => {
  // TODO: validate query with Joi
  if (req.query.q === undefined || req.query.q === '') {
    return res.status(400).json({ msg: 'Bad request' });
  }
  logger.info(`searching for q = ${req.query.q}`);
  const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
  return res.status(200).json(constructorSearch.search(req.query.q as string));
});

api.get('/constructors/all', (req: Request, res: Response) => {
  const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
  return res.status(200).json(constructorSearch.getAll());
});

api.post('/constructors/updateFav', async (req: Request, res: Response) => {
  // TODO: validate body with Joi
  const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
  try {
    await constructorSearch.updateFav(req.body.constructorId, req.body.fav);
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
});

api.get('/constructors/favs', (req: Request, res: Response) => {
  const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
  return res.status(200).json(constructorSearch.getFavs());
});

api.post('/constructors/reset', async (req: Request, res: Response) => {
  try {
    await ConstructorModel.deleteMany({});
    // TODO: cache the result of this operation:
    const constructors = await readCSV<Constructor>("./data/constructors.csv", (row) => ({
      constructorId: +row[0],
      constructorRef: row[1],
      name: row[2],
      nationality: row[3],
      url: row[4],
    }));
    await ConstructorModel.create(constructors);
    const createdDocs = await ConstructorModel.findAll();
    const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
    constructorSearch.updateConstructors(createdDocs);
    return res.status(200).json(createdDocs);
  } catch (error) {
    logger.error(`/constructors/reset: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

api.post('/constructors/deleteAll', async (req: Request, res: Response) => {
  try {
    await ConstructorModel.deleteMany({});
    const constructorSearch = api.get('constructorSearch') as ConstructorSearch;
    constructorSearch.updateConstructors([]);
    return res.status(200).json({});
  } catch (error) {
    logger.error(`/constructors/deleteAll: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

mongoose.connect(process.env.MONGO_CONNECTION_STRING as string, MONGOOSE_OPTIONS).then(async () => {
  logger.info('connection to mongo established!');
  api.listen(port, () => {
    api.set('constructorSearch', new ConstructorSearch([]));
    logger.info(`server is running at http://localhost:${port}`);
  });
}).catch((err) => {
  logger.error(`error connecting to mongoose: ${JSON.stringify(err, null, 2)}`);
});

