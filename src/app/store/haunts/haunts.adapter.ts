import { EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { Haunt } from "./haunt";

export const hauntsAdapter: EntityAdapter<Haunt> = createEntityAdapter<Haunt>({
  selectId: (haunt: Haunt) => haunt.key,
  sortComparer: (haunt: Haunt) => haunt.name
});
