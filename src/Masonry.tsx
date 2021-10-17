import { useState, useEffect, useMemo, useRef, Children, forwardRef, isValidElement } from 'react';
import useResize from './useResize';

function getCurrentParam<T, B extends { [key: string]: T } = any>(
  breakpoints: string[] | undefined,
  param: T | B,
  defaultValue: T
) {
  if (typeof param === 'object') {
    const breakpoint = breakpoints?.find((item) => (param as B)[item] !== undefined);
    return breakpoint !== undefined ? (param as B)[breakpoint] ?? defaultValue : defaultValue;
  }
  return param;
}

const DEFAULT_COLUMNS = 1;
const DEFAULT_GAP = 0;

type Element<T> = { element: T; index: number };

export interface MasonryProps<B = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  breakpoints?: B;
  columns?: number | { [P in keyof B]?: number };
  gap?: string | number | { [P in keyof B]?: string | number };
  reverse?: boolean;
  autoArrange?: boolean;
}

function MasonryComponent<B extends { [key: string]: number }>(
  {
    breakpoints,
    columns = DEFAULT_COLUMNS,
    gap = DEFAULT_GAP,
    reverse = false,
    autoArrange = false,
    children,
    style,
    ...otherProps
  }: MasonryProps<B>,
  forwardedRef?: React.Ref<HTMLDivElement>
) {
  const { currentBreakpoints } = useResize(breakpoints);

  const elements = useRef<Element<HTMLDivElement>[]>([]);

  const [arrange, setArrange] = useState(false);

  const [currentColumns, setCurrentColumns] = useState(() => {
    return getCurrentParam<number>(currentBreakpoints, columns, DEFAULT_COLUMNS);
  });
  const [currentGap, setCurrentGap] = useState(() => {
    return getCurrentParam<string | number>(currentBreakpoints, gap, DEFAULT_GAP);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (autoArrange && !arrange) setArrange(true);

    return () => {
      if (autoArrange && arrange) setArrange(false);
    };
  });

  // Устанвливаем количество колонок
  useEffect(() => {
    const param = getCurrentParam<number>(currentBreakpoints, columns, DEFAULT_COLUMNS);
    setCurrentColumns(param);
  }, [columns, currentBreakpoints]);

  // Устанавливаем отступ между элементами
  useEffect(() => {
    const param = getCurrentParam<string | number>(currentBreakpoints, gap, DEFAULT_GAP);
    setCurrentGap(param);
  }, [gap, currentBreakpoints]);

  // Устанавливаем дочерние элементы в колонки
  const layout = useMemo(() => {
    if (currentColumns < 1) return [];

    const arrayOfChildren = Children.toArray(children);
    if (reverse) arrayOfChildren.reverse();

    const newLayout = Array.from({ length: currentColumns }, () => {
      return [] as Element<JSX.Element>[];
    });

    const columnHeights = newLayout.map(() => 0);

    const getcolumnIndex = (index: number) => {
      if (autoArrange && arrange && elements.current.length > 0) {
        // Находим индекс колонки с минимальной высотой
        const columnIndex = columnHeights.findIndex((item) => {
          return item === Math.min(...columnHeights);
        });
        // Обновляем высоту текущей колонки. Поскольку позиция элементов может измениться
        // после расределения по колонкам, сравниваем индекс элемента с кэшированным индексом из массива
        const element = elements.current.find((item) => item.index === index);
        const elementHeight = element?.element.getBoundingClientRect().height;
        columnHeights[columnIndex] += elementHeight || 0;

        return columnIndex;
      }
      return index % currentColumns;
    };

    arrayOfChildren.forEach((child, index) => {
      if (child && isValidElement(child)) {
        newLayout[getcolumnIndex(index)].push({ element: child, index });
      }
    });

    return newLayout;
  }, [arrange, autoArrange, children, currentColumns, reverse]);

  // `temporaryElements` временно заполняется элементами, чтобы объект `elements`
  // всегда содержал правильное количество элементов
  const temporaryElements = [] as Element<HTMLDivElement>[];

  const addElement = (index: number) => (element: HTMLDivElement | null) => {
    if (element !== null) {
      temporaryElements.push({ element, index });
      elements.current = temporaryElements;
    }
  };

  return (
    <div ref={forwardedRef} style={{ display: 'flex', ...style }} {...otherProps}>
      {/* Добавляем колонки */}
      {layout.map((column, columnIndex) => (
        <div key={columnIndex} style={{ flex: 1, paddingLeft: columnIndex && currentGap }}>
          {/* Добавляем элементы */}
          {column.map((item, itemIndex) => (
            <div
              key={itemIndex}
              ref={addElement(item.index)}
              style={{ paddingTop: itemIndex && currentGap }}
            >
              {item.element}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const Masonry = forwardRef(MasonryComponent) as <B extends { [key: string]: number }>(
  // eslint-disable-next-line no-unused-vars
  props: MasonryProps<B> & React.RefAttributes<HTMLDivElement>
) => JSX.Element;

export default Masonry;
