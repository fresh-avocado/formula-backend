import Fuse from 'fuse.js';
import { Constructor } from 'src/utils/types/constructor';

class ConstructorSearch {
  private constructors: Constructor[];
  private fuse: Fuse<Constructor>;
  private searchOptions: Fuse.FuseSearchOptions = { limit: 10 };

  constructor(constructors: Constructor[]) {
    this.constructors = constructors;
    this.fuse = new Fuse(this.constructors, {
      keys: ['name'],
      threshold: 0.4,
    });
  }

  updateFav(constructorId: number, isFav: boolean): void {
    for (let i = 0; i < this.constructors.length; i++) {
      if (this.constructors[i].constructorId === constructorId) {
        this.constructors[i].isFavorite = isFav;
        return; // no need to keep iterating
      }
    }
  }

  getFavs(): Constructor[] {
    return this.constructors.filter((constructor) => constructor.isFavorite);
  }

  search(query: string): Constructor[] {
    return this.fuse.search(query, this.searchOptions).map((fuseResult) => fuseResult.item);
  }
}

export default ConstructorSearch;
