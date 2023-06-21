import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

export const readCSV = async <T>(absolutePath: string, rowToType: (row: string[]) => T | undefined): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    fs.createReadStream(path.resolve(process.cwd(), absolutePath)).pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", (row) => {
        const t = rowToType(row);
        if (t !== undefined) {
          result.push(t);
        }
        // if `undefined`, that means
        // don't push current row into
        // results
      })
      .on('error', (err) => {
        reject(err.message);
      })
      .on('end', async () => {
        resolve(result);
      });
  });
}

export const readCSVAsyncResolver = async <T>(absolutePath: string, rowToType: (row: string[]) => Promise<T | undefined>): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    fs.createReadStream(path.resolve(process.cwd(), absolutePath)).pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", async (row) => {
        const t = await rowToType(row);
        if (t !== undefined) {
          result.push(t);
        }
        // if `undefined`, that means
        // don't push current row into
        // results
      })
      .on('error', (err) => {
        reject(err.message);
      })
      .on('end', async () => {
        resolve(result);
      });
  });
}

