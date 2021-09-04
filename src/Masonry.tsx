import { useState, useEffect, useMemo, Children, isValidElement } from 'react';

export interface MasonryProps<B = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  breakpoints?: B;
  // eslint-disable-next-line no-unused-vars
  columns?: number | { [P in keyof B]?: number };
  // eslint-disable-next-line no-unused-vars
  gap?: string | number | { [P in keyof B]?: string | number };
}

export default function Masonry<B extends { [key: string]: number }>(props: MasonryProps<B>) {
  const { breakpoints, columns, gap, children, style, ...other } = props;

  const [currentBreakpoints, setCurrentBreakpoints] = useState<string[] | undefined>(undefined);
  const [currentСolumns, setCurrentColumns] = useState<number | undefined>(undefined);
  const [currentGap, setCurrentGap] = useState<string | number | undefined>(undefined);

  // Записываем текущую ширину страницы
  useEffect(() => {
    let breakpoint: string | undefined;

    const handleResize = () => {
      // Нормализуем контрольные точки с сортировкой от большего к меньшему
      const normalizedBreakpoints =
        breakpoints && Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
      // Выбераем досупные контрольные точки
      const filteredBreakpoints = normalizedBreakpoints
        ?.filter((item) => item[1] <= window.innerWidth)
        .map((item) => item[0]);

      if (breakpoint !== filteredBreakpoints?.[0]) {
        breakpoint = filteredBreakpoints?.[0];
        setCurrentBreakpoints(filteredBreakpoints);
      }
    };

    // Инициализируем контрольные точки
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]);

  useEffect(() => {
    if (typeof columns === 'object') {
      const breakpoint = currentBreakpoints?.find((item) => columns[item] !== undefined);
      setCurrentColumns(breakpoint ? columns[breakpoint] : 1);
    } else {
      setCurrentColumns(columns || 1);
    }
  }, [columns, currentBreakpoints]);

  useEffect(() => {
    if (typeof gap === 'object') {
      const breakpoint = currentBreakpoints?.find((item) => gap[item] !== undefined);
      setCurrentGap(breakpoint && gap[breakpoint]);
    } else {
      setCurrentGap(gap);
    }
  }, [gap, currentBreakpoints]);

  // Устанавливаем дочерние элементы поочереди в каждую колонку
  const content = useMemo(() => {
    const countColumns = currentСolumns || 0;
    const content: JSX.Element[][] = Array.from({ length: countColumns }, () => []);

    if (content.length > 0) {
      Children.forEach(children, (child, index) => {
        if (child && isValidElement(child)) {
          content[index % countColumns].push(child);
        }
      });
    }

    return content;
  }, [children, currentСolumns]);

  return (
    <div style={{ ...style, display: 'flex' }} {...other}>
      {/* Добавляем колонки */}
      {content.map((items, index) => (
        <div key={index} style={{ flex: 1, paddingLeft: index && currentGap }}>
          {/* Добавляем элементы */}
          {items.map((item, index) => (
            <div key={index} style={{ paddingTop: index && currentGap }}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
