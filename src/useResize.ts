/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';

/**
 * Запускает процесс вычисления текущей контрольной точки по ширине окна браузера.
 * @param breakpoints контрольные точки переданные в `props` компоненту `Masonry`
 * @param align если `true`, компонент будет повторно отрисован при изменении ширины окна браузера
 * @returns объект со свойством текущих контрольных точек и ширины окна браузера
 */
export function useResize(breakpoints: { [key: string]: number } | undefined, align?: boolean) {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [currentBreakpoints, setCurrentBreakpoints] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    // Кэшируем текущую контрольную точку для предотвращения лишних отрисовок
    let breakpoint: string | undefined;

    const handleResize = () => {
      // Нормализуем контрольные точки с сортировкой от большего к меньшему
      const normalizedBreakpoints =
        breakpoints && Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);

      // Выбераем текущие контрольные точки
      const filteredBreakpoints = normalizedBreakpoints
        ?.filter((item) => item[1] <= window.innerWidth)
        .map((item) => item[0]);

      // Запоминаем текущую контрольную точку
      if (breakpoint !== filteredBreakpoints?.[0]) {
        breakpoint = filteredBreakpoints?.[0];
        setCurrentBreakpoints(filteredBreakpoints);
      }

      // Устанавливаем текущую ширину, если разрешено автоматическое позиционирование
      if (align) {
        setWidth(window.innerWidth);
      }
    };

    // Инициализируем состояние
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints, align]);

  return { currentBreakpoints, width };
}
