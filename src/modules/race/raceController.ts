import express, { Request, Response, Router } from "express";
import loggerService from "../../services/logger";
import { RaceModel } from "../../models/Race";
import { resetRaces } from "./raceService";

const logger = loggerService.child({ module: 'raceController.ts' });

const raceController: Router = express.Router();

raceController.post('/reset', async (req: Request, res: Response) => {
  try {
    const races = await resetRaces();
    return res.status(200).json(races);
  } catch (error) {
    logger.error(`/races/reset: ${(error as Error).message}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

raceController.get('/all', async (req: Request, res: Response) => {
  const races = await RaceModel.findAll();
  return res.status(200).json(races);
});

export default raceController;
