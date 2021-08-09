import { useState, useEffect, useMemo, Children, isValidElement } from 'react';
import { normalizeBreakpoints } from './utils';
import { Columns, Gap, Breakpoints, NormalizedBreakpoints } from './types';

export type MasonryProps = React.PropsWithChildren<{
  columns?: Columns;
  gap?: Gap;
  breakpoints?: Breakpoints;
  style?: React.CSSProperties;
  className?: string;
}>;

export default function Masonry(props: MasonryProps) {
  const {
    children,
    columns = { xs: 1 },
    gap = { xs: 0 },
    breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    style,
    className,
  } = props;

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
    if (normalizedBreakpoints !== null) {
      const currentBreakpointIndex = normalizedBreakpoints.findIndex((item, index, array) => {
        return width >= item[1] || index === array.length - 1;
      });

      const breakpointForColumns = normalizedBreakpoints.find((item, index) => {
        return index >= currentBreakpointIndex && columns[item[0]] !== undefined;
      });

      if (breakpointForColumns) {
        setCurrentColumns(columns[breakpointForColumns[0]]);
      }

      const breakpointForGap = normalizedBreakpoints.find((item, index) => {
        return index >= currentBreakpointIndex && gap[item[0]] !== undefined;
      });

      if (breakpointForGap) {
        setCurrentGap(gap[breakpointForGap[0]]);
      }
    }
  }, [columns, gap, normalizedBreakpoints, width]);

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
      {currentСolumns !== null && currentGap !== null
        ? content.map((items, index) => (
            <div
              key={`${id}-column-${index + 1}`}
              id={`${id}-column-${index + 1}`}
              style={{ flex: 1, marginLeft: index > 0 ? currentGap : undefined }}
            >
              {items.map((item, index) => (
                <div
                  key={`${id}-item-${index + 1}`}
                  id={`${id}-item-${index + 1}`}
                  style={{ marginTop: index > 0 ? currentGap : undefined }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))
        : null}
    </div>
  );
}
