import Fuse from 'fuse.js';
import { Constructor, ConstructorModel } from '../models/Constructor';
import loggerService from './logger';

const logger = loggerService.child({ module: 'constructorSearch.ts' });

class ConstructorSearch {
  private constructors: Constructor[];
  private fuse: Fuse<Constructor>;
  private searchOptions: Fuse.FuseSearchOptions = { limit: 10 };

  // TODO: worker thread xq mucho trabajo en el main thread

  constructor(constructors: Constructor[], ttlMinutes = 0.1) {
    logger.debug('ConstructorSearch instantiated!');
    this.constructors = constructors;
    this.fuse = new Fuse(this.constructors, {
      keys: ['name'],
      threshold: 0.4,
    });
    setInterval(() => this.revalidate(), ttlMinutes * 60_000);
  }

  async updateFav(constructorId: number, isFav: boolean): Promise<void> {
    try {
      // update BD
      await ConstructorModel.updateIsFavorite(constructorId, isFav);
      // then update cache
      for (let i = 0; i < this.constructors.length; i++) {
        if (this.constructors[i].constructorId === constructorId) {
          this.constructors[i].isFavorite = isFav;
          return; // no need to keep iterating
        }
      }
    } catch (error) {
      logger.error(`updateFav(${constructorId}, ${isFav}): ${JSON.stringify(error, null, 2)}`);
      throw Error('could not mark constructor as fav');
    }
  }

  getFavs(): Constructor[] {
    return this.constructors.filter((constructor) => constructor.isFavorite === true);
  }

  getAll(): readonly Constructor[] {
    return this.constructors;
  }

  search(query: string): Constructor[] {
    return this.fuse.search(query, this.searchOptions).map((fuseResult) => fuseResult.item);
  }

  updateConstructors(newConstructors: Constructor[]): void {
    this.fuse.setCollection(newConstructors);
  }

  async revalidate(): Promise<void> {
    logger.info('revalidating constructors cache...');
    try {
      const freshData = await ConstructorModel.findAll() as Constructor[];
      this.constructors = freshData;
      this.fuse.setCollection(freshData);
      logger.info(`cache revalidated with ${freshData.length} new entries!`);
    } catch (error) {
      logger.error(`revalidate(): ${(error as Error).message}`);
    }
  }
}

export default new ConstructorSearch([]);
