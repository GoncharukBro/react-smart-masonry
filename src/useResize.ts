import { useState, useEffect } from 'react';

type Breakpoints = { [key: string]: number } | undefined;

function getCurrentBreakpoints(breakpoints: Breakpoints, width: number) {
  // Нормализуем контрольные точки с сортировкой от большего к меньшему
  const normalizedBreakpoints =
    breakpoints && Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
  // Выбераем текущие контрольные точки
  return normalizedBreakpoints?.filter((item) => item[1] <= width).map((item) => item[0]);
}

/**
 * Запускает процесс вычисления текущей контрольной точки по ширине окна браузера.
 * @param breakpoints контрольные точки переданные в `props` компоненту `Masonry`
 * @returns объект со свойством текущих контрольных точек и ширины окна браузера
 */
export default function useResize(breakpoints: Breakpoints) {
  const [state, setState] = useState(() => ({
    width: window.innerWidth,
    currentBreakpoints: getCurrentBreakpoints(breakpoints, window.innerWidth),
  }));

  useEffect(() => {
    const handleResize = () => {
      setState({
        width: window.innerWidth,
        currentBreakpoints: getCurrentBreakpoints(breakpoints, window.innerWidth),
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]);

  return state;
}
