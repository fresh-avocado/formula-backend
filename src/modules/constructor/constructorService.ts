import { Constructor, ConstructorModel } from "../../models/Constructor";
import constructorSearch from "../../services/constructorSearch";
import { readCSV } from "../../utils/functions/readCSV";

export const resetConstructors = async (): Promise<Constructor[]> => {
  const [, constructors] = await Promise.all([
    ConstructorModel.deleteMany({}),
    readCSV<Constructor>("data/constructors.csv", (row) => ({
      constructorId: +row[0],
      constructorRef: row[1],
      name: row[2],
      nationality: row[3],
      url: row[4],
      yearlyResults: {},
    }))
  ]);
  await ConstructorModel.create(constructors);
  const createdDocs = await ConstructorModel.findAll();
  constructorSearch.updateConstructors(createdDocs);
  return createdDocs as Constructor[];
};

export const deleteConstructors = async (): Promise<void> => {
  await ConstructorModel.deleteMany({});
  constructorSearch.updateConstructors([]);
};
