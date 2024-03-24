import type { Action } from "../Action/types";

export interface Step {
  name: string;
  actions: Action[];
}
