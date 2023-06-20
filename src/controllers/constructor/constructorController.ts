import express, { Request, Response, Router } from "express";
import { Constructor, ConstructorModel } from "../../models/Constructor";
import constructorSearch from "../../services/constructorSearch";
import loggerService from "../../services/logger";
import { readCSV } from "../../utils/functions/readCSV";
import { validateBody, validateQueryParams } from "../../utils/functions/schemaValidation";
import { getConstructorsQuerySchema, updateFavoriteBodySchema } from "./constructorSchemas";

const logger = loggerService.child({ module: 'constructorController.ts' });

const constructorController: Router = express.Router();

constructorController.get('/constructors', validateQueryParams(getConstructorsQuerySchema), (req: Request, res: Response) => {
  logger.info(`searching for q = ${req.query.q}`);
  return res.status(200).json(constructorSearch.search(req.query.q as string));
});

constructorController.get('/constructors/all', (req: Request, res: Response) => {
  return res.status(200).json(constructorSearch.getAll());
});

constructorController.post('/constructors/updateFav', validateBody(updateFavoriteBodySchema), async (req: Request, res: Response) => {
  try {
    await constructorSearch.updateFav(req.body.constructorId, req.body.fav);
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
});

constructorController.get('/constructors/favs', (req: Request, res: Response) => {
  return res.status(200).json(constructorSearch.getFavs());
});

constructorController.post('/constructors/reset', async (req: Request, res: Response) => {
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
    constructorSearch.updateConstructors(createdDocs);
    return res.status(200).json(createdDocs);
  } catch (error) {
    logger.error(`/constructors/reset: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

constructorController.post('/constructors/deleteAll', async (req: Request, res: Response) => {
  try {
    await ConstructorModel.deleteMany({});
    constructorSearch.updateConstructors([]);
    return res.status(200).json({});
  } catch (error) {
    logger.error(`/constructors/deleteAll: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

export default constructorController;
