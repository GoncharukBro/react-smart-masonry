export type Columns<K extends string | number | symbol> = {
  [Property in K]?: number;
};

export type Gap<K extends string | number | symbol> = {
  [Property in K]?: number;
};

export type Breakpoints = {
  [key: string]: number;
};

export type NormalizedBreakpoints = [string, number][];
