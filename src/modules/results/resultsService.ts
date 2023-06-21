import { resetConstructors } from "../constructor/constructorService";
import { resetDrivers } from "../driver/driverService";
import { resetRaces } from "../race/raceService";
import { readCSVAsyncResolver } from "../../utils/functions/readCSV";
import { RaceModel } from "../../models/Race";
import { DriverModel } from "../../models/Driver";
import { ConstructorModel } from "../../models/Constructor";

export const generateResultData = async (): Promise<void> => {
  await Promise.all([
    resetConstructors(),
    resetDrivers(),
    resetRaces()
  ]);
  const promises = await readCSVAsyncResolver<unknown>("data/results.csv", async (row) => {
    const raceId = +row[1];
    const driverId = +row[2];
    const constructorId = +row[3];
    // eslint-disable-next-line no-useless-escape
    const position = row[6] === '\N' ? 0 : +row[6];
    const [race, driver] = await Promise.all([
      RaceModel.getById(raceId, ['name', 'year']),
      DriverModel.getById(driverId, ['foreName', 'surName'])
    ]);
    if (race !== null && driver !== null) {
      return ConstructorModel.addResult({
        constructorId,
        year: race.year,
        result: {
          driverId,
          driverName: `${driver.foreName} ${driver.surName}`,
          raceId,
          raceName: race.name,
          position,
        },
      });
    } else {
      return undefined;
    }
  });
  await Promise.all(promises);
};