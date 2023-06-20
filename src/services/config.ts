import dotenv from 'dotenv';
import path from 'path';

class Config {
  constructor() {
    dotenv.config({ path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev') });
  }

  get<T>(key: string): T {
    if (process.env[key] === undefined) {
      throw new Error(`env does not contain the key ${key}`);
    } else {
      return process.env[key] as T;
    }
  }
}

export default new Config();
