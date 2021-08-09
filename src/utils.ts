import { Breakpoints, NormalizedBreakpoints } from './types';

export function normalizeBreakpoints(breakpoints: Breakpoints): NormalizedBreakpoints {
  return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
}

export function applyBreakpointsKeys(keys: string[], values: number[]) {
  return keys.reduce((prev, item, index) => {
    return { ...prev, [item]: values[index] };
  }, {} as { [key: string]: number });
}
