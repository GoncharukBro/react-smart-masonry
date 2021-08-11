import { Breakpoints, NormalizedBreakpoints } from './types';

/**
 * Формирует объект в формате key - ключ точки останова, value - значение для данного ключа
 * @param keys ключи точек останова
 * @param values значения для точек останова
 * @returns объект с ключами точек останова и начениями
 */
export function applyBreakpointsKeys(keys: string[], values: number[]) {
  return keys.reduce((prev, item, index) => {
    return { ...prev, [item]: values[index] };
  }, {} as { [key: string]: number });
}

/**
 * Нормализует точки останова для дальнейшего манипулирования ими.
 * Например, `{ xs: 0, sm: 600 }` примет вид `[['xs', 0], ['sm', 600]]`
 * @param breakpoints исходные точки останова
 * @returns нормализованные точки останова
 */
export function normalizeBreakpoints(breakpoints: Breakpoints): NormalizedBreakpoints {
  return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
}

/**
 * Находит текущую точку останова для конкретного параметра
 * @param normalizedBreakpoints нормализованные точки останова
 * @param width текущая ширина экрана
 * @param param параметр для которого нужно найти точку останова
 * @returns значение параметра по найденой точке останова
 */
export const getCurrentParam = (
  normalizedBreakpoints: NormalizedBreakpoints,
  width: number,
  param: any
) => {
  const currentParam = normalizedBreakpoints.find((item, index, array) => {
    return (width >= item[1] || index === array.length - 1) && param[item[0]] !== undefined;
  });

  return currentParam ? param[currentParam[0]] : undefined;
};
