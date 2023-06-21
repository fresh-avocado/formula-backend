import express, { Request, Response, Router } from "express";
import loggerService from "../../services/logger";
import { readCSV } from "../../utils/functions/readCSV";
import { Race, RaceModel } from "../../models/Race";

const logger = loggerService.child({ module: 'raceController.ts' });

const raceController: Router = express.Router();

raceController.post('/reset', async (req: Request, res: Response) => {
  try {
    await RaceModel.deleteMany({});
    const races = await readCSV<Race>("./data/races.csv", (row) => {
      const year = +row[1];
      if (year >= 2010 && year <= 2020) {
        return {
          raceId: +row[0],
          year: year,
          name: row[4],
        };
      } else {
        return undefined;
      }
    });
    await RaceModel.create(races);
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
