import {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  Children,
  forwardRef,
  isValidElement,
} from 'react';
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

  const [currentColumns, setCurrentColumns] = useState(() => {
    return getCurrentParam<number>(currentBreakpoints, columns, DEFAULT_COLUMNS);
  });
  const [currentGap, setCurrentGap] = useState(() => {
    return getCurrentParam<string | number>(currentBreakpoints, gap, DEFAULT_GAP);
  });

  // Устанавливаем дочерние элементы в колонки
  const scheme: Element<JSX.Element>[][] = useMemo(() => {
    if (currentColumns < 1) return [];

    const arrayOfChildren = Children.toArray(children);
    if (reverse) arrayOfChildren.reverse();

    const newScheme = Array.from({ length: currentColumns }, () => {
      return [] as Element<JSX.Element>[];
    });

    arrayOfChildren.forEach((child, index) => {
      if (child && isValidElement(child)) {
        if (autoArrange) {
          console.log('align');
          const columnHeights = newScheme.map(() => 0);

          // Находим индекс колонки с минимальной высотой
          const columnIndex = columnHeights.findIndex((item) => {
            return item === Math.min(...columnHeights);
          });
          if (columnIndex !== -1) {
            newScheme[columnIndex].push({ element: child, index });
            // Обновляем высоту текущей колонки. Поскольку позиция элементов может измениться
            // после расределения по колонкам, сравниваем индекс элемента с кэшированным индексом из массива
            const element = elements.current.find((item) => item.index === index);
            const elementHeight = element?.element.getBoundingClientRect().height;
            columnHeights[columnIndex] += elementHeight || 0;
          }
        } else {
          console.log('not-align');
          const columnIndex = index % currentColumns;
          newScheme[columnIndex].push({ element: child, index });
        }
      }
    });

    return newScheme;
  }, [autoArrange, children, currentColumns, reverse]);

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

  // `temporaryElements` временно заполняется элементами, чтобы объект `elements`
  // всегда содержал правильное количество элементов
  const temporaryElements = [] as Element<HTMLDivElement>[];

  const addElement = (index: number, isLast: boolean) => (element: HTMLDivElement | null) => {
    if (element !== null) {
      temporaryElements.push({ element, index });
      elements.current = temporaryElements;

      if (isLast) {
        console.log('last');
      }
    }
  };

  console.log('pre-render');

  return (
    <div ref={forwardedRef} style={{ display: 'flex', ...style }} {...otherProps}>
      {/* Добавляем колонки */}
      {scheme.map((column, columnIndex) => (
        <div key={columnIndex} style={{ flex: 1, paddingLeft: columnIndex && currentGap }}>
          {/* Добавляем элементы */}
          {column.map((item, itemIndex) => (
            <div
              key={itemIndex}
              ref={addElement(
                item.index,
                columnIndex + 1 === scheme.length && itemIndex + 1 === column.length
              )}
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
