import express, { Request, Response, Router } from "express";
import loggerService from "../../services/logger";
import { DriverModel } from "../../models/Driver";
import { resetDrivers } from "./driverService";

const logger = loggerService.child({ module: 'driverController.ts' });

const driverController: Router = express.Router();

driverController.post('/reset', async (req: Request, res: Response) => {
  try {
    const createdDrivers = await resetDrivers();
    return res.status(200).json(createdDrivers);
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
