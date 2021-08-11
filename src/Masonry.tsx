import { useState, useEffect, useMemo, Children, isValidElement } from 'react';
import { normalizeBreakpoints, getCurrentParam } from './utils';
import { Columns, Gap, Breakpoints, NormalizedBreakpoints } from './types';

export type MasonryProps<T> = React.PropsWithChildren<{
  breakpoints?: T;
  columns: Columns<keyof T> | number;
  gap?: Gap<keyof T> | number;
  style?: React.CSSProperties;
  className?: string;
}>;

export default function Masonry<T extends Breakpoints>(props: MasonryProps<T>) {
  const { children, breakpoints, columns, gap, style, className } = props;

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
    if (breakpoints) {
      setNormalizedBreakpoints(normalizeBreakpoints(breakpoints));
    }
  }, [breakpoints]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    if (typeof columns === 'object' && normalizedBreakpoints !== null) {
      const gettingCurrentColumns = getCurrentParam(normalizedBreakpoints, width, columns);
      if (gettingCurrentColumns !== undefined) setCurrentColumns(gettingCurrentColumns);
    }
    if (typeof columns === 'number') {
      setCurrentColumns(columns);
    }
  }, [columns, normalizedBreakpoints, width]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    if (typeof gap === 'object' && normalizedBreakpoints !== null) {
      const gettingCurrentGap = getCurrentParam(normalizedBreakpoints, width, gap);
      if (gettingCurrentGap !== undefined) setCurrentGap(gettingCurrentGap);
    }
    if (typeof gap === 'number') {
      setCurrentGap(gap);
    }
  }, [gap, normalizedBreakpoints, width]);

  // Устанавливаем дочерние элементы поочереди в каждую колонку
  const content = useMemo(() => {
    const content: JSX.Element[][] = Array.from({ length: currentСolumns || 0 }, () => []);

    if (currentСolumns !== null) {
      Children.forEach(children, (child, index) => {
        if (child && isValidElement(child)) {
          content[index % currentСolumns].push(child);
        }
      });
    }

    return content;
  }, [children, currentСolumns]);

  const id = 'react-flexible-masonry';

  return (
    <div id={id} style={{ ...style, display: 'flex' }} className={className}>
      {content.map((items, index) => (
        <div
          key={`${id}-column-${index + 1}`}
          id={`${id}-column-${index + 1}`}
          style={{
            flex: 1,
            marginLeft: currentGap !== null && index > 0 ? currentGap : undefined,
          }}
        >
          {items.map((item, index) => (
            <div
              key={`${id}-item-${index + 1}`}
              id={`${id}-item-${index + 1}`}
              style={{
                marginTop: currentGap !== null && index > 0 ? currentGap : undefined,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
