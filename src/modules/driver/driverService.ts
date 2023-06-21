import { readCSV } from "../../utils/functions/readCSV";
import { Driver, DriverModel } from "../../models/Driver";

export const resetDrivers = async (): Promise<Driver[]> => {
  const [, drivers] = await Promise.all([
    await DriverModel.deleteMany({}),
    readCSV<Driver>("data/drivers.csv", (row) => ({
      driverId: +row[0],
      foreName: row[4],
      surName: row[5],
      dateOfBirth: row[6],
      nationality: row[7],
    }))
  ]);
  await DriverModel.create(drivers);
  const createdDocs = await DriverModel.findAll();
  return createdDocs as Driver[];
}