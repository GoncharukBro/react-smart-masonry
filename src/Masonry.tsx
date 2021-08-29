import { useState, useEffect, useMemo, Children, isValidElement } from 'react';
import { setParam } from './utils';

// eslint-disable-next-line no-unused-vars
type Param<T> = keyof T extends never ? never : { [P in keyof T]?: number };

export type MasonryProps<T = unknown> = React.PropsWithChildren<{
  style?: React.CSSProperties;
  className?: string;
  breakpoints?: T;
  columns?: number | Param<T>;
  gap?: number | Param<T>;
}>;

export default function Masonry<T = unknown>(
  props: MasonryProps<T extends { [key: string]: number } ? T : never>
) {
  const { children, style, className, breakpoints, columns, gap } = props;

  const [width, setWidth] = useState(window.innerWidth);
  const [normalizedBreakpoints, setNormalizedBreakpoints] = useState<
    [string, number][] | undefined
  >(undefined);
  const [currentСolumns, setCurrentColumns] = useState<number | undefined>(undefined);
  const [currentGap, setCurrentGap] = useState<number | undefined>(undefined);

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
      setNormalizedBreakpoints(() => {
        return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
      });
    }
  }, [breakpoints]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    setParam(normalizedBreakpoints, width, columns, (param) => {
      setCurrentColumns(param || 1);
    });
  }, [columns, normalizedBreakpoints, width]);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    setParam(normalizedBreakpoints, width, gap, (param) => {
      setCurrentGap(param);
    });
  }, [gap, normalizedBreakpoints, width]);

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

  const id = 'react-flexible-masonry';

  return (
    <div id={id} style={{ ...style, display: 'flex' }} className={className}>
      {/* Добавляем колонки */}
      {content.map((items, index) => {
        const columnId = `${id}-column-${index + 1}`;

        return (
          <div key={columnId} id={columnId} style={{ flex: 1, marginLeft: index && currentGap }}>
            {/* Добавляем элементы */}
            {items.map((item, index) => {
              const itemId = `${columnId}-item-${index + 1}`;

              return (
                <div key={itemId} id={itemId} style={{ marginTop: index && currentGap }}>
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
