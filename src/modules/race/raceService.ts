import { readCSV } from "../../utils/functions/readCSV";
import { Race, RaceModel } from "../../models/Race";

export const resetRaces = async (): Promise<Race[]> => {
  const [, races] = await Promise.all([
    await RaceModel.deleteMany({}),
    readCSV<Race>("data/races.csv", (row) => {
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
    })
  ]);
  await RaceModel.create(races);
  const createdDocs = await RaceModel.findAll();
  return createdDocs as Race[];
}