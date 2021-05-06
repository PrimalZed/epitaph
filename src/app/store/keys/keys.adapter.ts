import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { Key } from "./key";

export const keysAdapter: EntityAdapter<Key> = createEntityAdapter<Key>({
  selectId: (key: Key) => key.key,
  sortComparer: (a: Key, b: Key) => a.name.localeCompare(b.name)
});
