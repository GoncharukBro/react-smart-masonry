import { useState, useEffect, useMemo, Children, isValidElement } from 'react';
import { normalizeBreakpoints, getCurrentParam, getMargin } from './utils';
import { Breakpoints, NormalizedBreakpoints } from './types';

const DEFAULT_BREAKPOINTS = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

type DefaultBreakpoints = typeof DEFAULT_BREAKPOINTS;

export type MasonryProps<T> = React.PropsWithChildren<{
  breakpoints?: T;
  // eslint-disable-next-line no-unused-vars
  columns: { [Property in keyof T]?: number } | number;
  // eslint-disable-next-line no-unused-vars
  gap?: { [Property in keyof T]?: number } | number;
  style?: React.CSSProperties;
  className?: string;
}>;

type OptionalBreakpoints<T> = T extends Breakpoints ? T : DefaultBreakpoints;

export default function Masonry<T>(props: MasonryProps<OptionalBreakpoints<T>>) {
  const { children, breakpoints = DEFAULT_BREAKPOINTS, columns, gap, style, className } = props;

  const [width, setWidth] = useState(window.innerWidth);
  const [normalizedBreakpoints, setNormalizedBreakpoints] = useState<NormalizedBreakpoints | null>(
    null
  );
  const [currentСolumns, setCurrentColumns] = useState<number | null>(null);
  const [currentGap, setCurrentGap] = useState<number | null>(null);

  // Записываем текущую ширину страницы
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Нормализуем точки останова
  useEffect(() => {
    setNormalizedBreakpoints(normalizeBreakpoints(breakpoints));
  }, [breakpoints]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    if (typeof columns === 'object' && normalizedBreakpoints !== null) {
      const gettingCurrentColumns = getCurrentParam(normalizedBreakpoints, width, columns);
      setCurrentColumns(gettingCurrentColumns !== undefined ? gettingCurrentColumns : null);
    }
    if (typeof columns === 'number') {
      setCurrentColumns(columns);
    }
  }, [columns, normalizedBreakpoints, width]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    if (typeof gap === 'object' && normalizedBreakpoints !== null) {
      const gettingCurrentGap = getCurrentParam(normalizedBreakpoints, width, gap);
      setCurrentGap(gettingCurrentGap !== undefined ? gettingCurrentGap : null);
    }
    if (typeof gap === 'number') {
      setCurrentGap(gap);
    }
  }, [gap, normalizedBreakpoints, width]);

  // Устанавливаем дочерние элементы поочереди в каждую колонку
  const content = useMemo(() => {
    const countColumns = currentСolumns || Children.count(children);
    const content: JSX.Element[][] = Array.from({ length: countColumns }, () => []);

    Children.forEach(children, (child, index) => {
      if (child && isValidElement(child)) {
        content[index % countColumns].push(child);
      }
    });

    return content;
  }, [children, currentСolumns]);

  const id = 'react-flexible-masonry';

  return (
    <div id={id} style={{ ...style, display: 'flex' }} className={className}>
      {content.map((items, index) => {
        const columnId = `${id}-column-${index + 1}`;

        return (
          <div
            key={columnId}
            id={columnId}
            style={{ flex: 1, marginLeft: getMargin(currentGap, index) }}
          >
            {items.map((item, index) => {
              const itemId = `${columnId}-item-${index + 1}`;

              return (
                <div key={itemId} id={itemId} style={{ marginTop: getMargin(currentGap, index) }}>
                  {item}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
