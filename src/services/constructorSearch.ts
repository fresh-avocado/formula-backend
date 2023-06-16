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
    const deletedConstructor = this.fuse.remove((constructor) => {
      return constructor.constructorId === constructorId;
    })[0];
    deletedConstructor.isFavorite = isFav;
    this.fuse.add(deletedConstructor);
  }

  search(query: string): Constructor[] {
    return this.fuse.search(query, this.searchOptions).map((fuseResult) => fuseResult.item);
  }
}

export default ConstructorSearch;
