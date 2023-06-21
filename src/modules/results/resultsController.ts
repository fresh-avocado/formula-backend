import express, { Request, Response, Router } from "express";
import loggerService from "../../services/logger";
import { generateResultData } from "./resultsService";

const logger = loggerService.child({ module: 'resultsController.ts' });

const resultsController: Router = express.Router();

resultsController.post('/generate', async (req: Request, res: Response) => {
  await generateResultData();
  logger.info('populated Constructors, Drivers and Races');
  return res.status(200).json({});
});

export default resultsController;
