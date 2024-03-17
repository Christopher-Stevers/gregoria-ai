export interface Status {
  status: string;
  intValue?: number;
  granular?: boolean;
  parent?: Action;
}

export interface Action {
  name: string;
  statuses: Status[];
}
