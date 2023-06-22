import express, { Request, Response, Router } from "express";
import constructorSearch from "../../services/constructorSearch";
import loggerService from "../../services/logger";
import { validateBody, validateQueryParams } from "../../utils/functions/schemaValidation";
import { getConstructorResultsSchema, getConstructorsQuerySchema, updateFavoriteBodySchema } from "./constructorSchemas";
import { deleteConstructors, resetConstructors } from "./constructorService";
import { ConstructorModel } from "../../models/Constructor";

const logger = loggerService.child({ module: 'constructorController.ts' });

const constructorController: Router = express.Router();

// TODO: tipar req.query y req.body
constructorController.get('/', validateQueryParams(getConstructorsQuerySchema), (req: Request, res: Response) => {
  logger.info(`searching for q = ${req.query.q}`);
  return res.status(200).json(constructorSearch.search(req.query.q as string));
});

constructorController.get('/all', (req: Request, res: Response) => {
  return res.status(200).json(constructorSearch.getAll());
});

constructorController.post('/updateFav', validateBody(updateFavoriteBodySchema), async (req: Request, res: Response) => {
  try {
    await constructorSearch.updateFav(req.body.constructorId, req.body.fav);
    return res.status(200).json({});
  } catch (error) {
    logger.error(`/constructors/updateFav: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: (error as Error).message });
  }
});

constructorController.get('/favs', (req: Request, res: Response) => {
  return res.status(200).json(constructorSearch.getFavs());
});

constructorController.post('/reset', async (req: Request, res: Response) => {
  try {
    const newConstructors = await resetConstructors();
    return res.status(200).json(newConstructors);
  } catch (error) {
    logger.error(`/constructors/reset: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

constructorController.post('/deleteAll', async (req: Request, res: Response) => {
  try {
    await deleteConstructors();
    return res.status(200).json({});
  } catch (error) {
    logger.error(`/constructors/deleteAll: ${JSON.stringify(error, null, 2)}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

constructorController.post('/results', validateBody(getConstructorResultsSchema), async (req: Request, res: Response) => {
  try {
    const results = await ConstructorModel.getResults(req.body);
    return res.status(200).json(results);
  } catch (error) {
    const errMsg = (error as Error).message;
    logger.error(`/constructors/results: ${errMsg}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

export default constructorController;
