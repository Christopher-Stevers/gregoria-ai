export interface Status {
  status: string;
  intValue?: number;
  granular?: boolean;
}

export interface Action {
  name: string;
  statuses: Status[];
}
