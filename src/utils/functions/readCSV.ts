import fs from "fs";
import { parse } from "csv-parse";

export const readCSV = async <T>(filename: string, rowToType: (row: string[]) => T): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    fs.createReadStream(filename).pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", (row) => {
        result.push(rowToType(row));
      })
      .on('error', (err) => {
        reject(err.message);
      })
      .on('end', async () => {
        resolve(result);
      });
  });
}

