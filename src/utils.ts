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
 * Устанавливает значение параметра соответствующего текущей точки останова
 * @param normalizedBreakpoints нормализованные точки останова
 * @param width текущая ширина экрана
 * @param param параметр для которого нужно найти точку останова
 * @param callback функция для пердачи значения параметра
 */
export function setParam<T extends number | { [key: string]: number | undefined } | undefined>(
  normalizedBreakpoints: [string, number][] | undefined,
  width: number,
  param: T,
  callback: (param: number | undefined) => void
) {
  if (typeof param === 'object') {
    const breakpoint = normalizedBreakpoints?.find(([breakpointKey, breakpointValue]) => {
      return width >= breakpointValue && param[breakpointKey] !== undefined;
    });
    callback(breakpoint && param[breakpoint[0]]);
  } else {
    callback(param);
  }
}
