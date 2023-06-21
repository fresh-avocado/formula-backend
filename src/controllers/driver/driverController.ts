import express, { Request, Response, Router } from "express";
import loggerService from "../../services/logger";
import { readCSV } from "../../utils/functions/readCSV";
import { Driver, DriverModel } from "../../models/Driver";

const logger = loggerService.child({ module: 'driverController.ts' });

const driverController: Router = express.Router();

driverController.post('/reset', async (req: Request, res: Response) => {
  try {
    await DriverModel.deleteMany({});
    const races = await readCSV<Driver>("./data/drivers.csv", (row) => ({
      driverId: +row[0],
      foreName: row[4],
      surName: row[5],
      dateOfBirth: row[6],
      nationality: row[7],
    }));
    await DriverModel.create(races);
    return res.status(200).json(races);
  } catch (error) {
    logger.error(`/driver/reset: ${(error as Error).message}`);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

driverController.get('/all', async (req: Request, res: Response) => {
  const races = await DriverModel.findAll();
  return res.status(200).json(races);
});

export default driverController;
