import { useState, useEffect, useMemo, Children, forwardRef, isValidElement } from 'react';
import { useResize } from './useResize';

type Element<T> = { element: T; index: number };

export interface MasonryProps<B = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  breakpoints?: B;
  // eslint-disable-next-line no-unused-vars
  columns?: number | { [P in keyof B]?: number };
  // eslint-disable-next-line no-unused-vars
  gap?: string | number | { [P in keyof B]?: string | number };
  reverse?: boolean;
  disableAlign?: boolean;
}

const Masonry = forwardRef(
  <B extends { [key: string]: number }>(
    props: MasonryProps<B>,
    ref?: React.Ref<HTMLDivElement>
  ) => {
    const { breakpoints, columns, gap, reverse, disableAlign, children, style, ...other } = props;

    const { currentBreakpoints, width } = useResize(breakpoints, !disableAlign);

    const [elements, setElements] = useState<Element<HTMLDivElement>[]>([]);
    const [currentColumns, setCurrentColumns] = useState<number | undefined>(undefined);
    const [currentGap, setCurrentGap] = useState<string | number | undefined>(undefined);

    // Выполняем сброс для перерасчета высоты элементов
    useEffect(() => {
      setElements([]);
    }, [children, width]);

    // Устанвливаем количество колонок
    useEffect(() => {
      if (typeof columns === 'object') {
        const breakpoint = currentBreakpoints?.find((item) => columns[item] !== undefined);
        setCurrentColumns(breakpoint ? columns[breakpoint] : 1);
      } else {
        setCurrentColumns(columns || 1);
      }
    }, [columns, currentBreakpoints]);

    // Устанавливаем отступ между элементами
    useEffect(() => {
      if (typeof gap === 'object') {
        const breakpoint = currentBreakpoints?.find((item) => gap[item] !== undefined);
        setCurrentGap(breakpoint && gap[breakpoint]);
      } else {
        setCurrentGap(gap);
      }
    }, [gap, currentBreakpoints]);

    // Устанавливаем дочерние элементы в колонки
    const content = useMemo(() => {
      const countColumns = currentColumns || 0;
      const content = Array.from({ length: countColumns }, () => [] as Element<JSX.Element>[]);
      const columnHeights = content.map(() => 0);
      const arrayOfChildren = Children.toArray(children);

      if (reverse) {
        arrayOfChildren.reverse();
      }

      if (content.length > 0) {
        arrayOfChildren.forEach((child, index) => {
          if (child && isValidElement(child)) {
            // При включенном автопозиционировании
            if (elements.length > 0) {
              // Находим индекс колонки с минимальной высотой
              const minColumnHeight = Math.min(...columnHeights);
              const columnIndex = columnHeights.findIndex((item) => item === minColumnHeight);

              if (columnIndex !== -1) {
                content[columnIndex].push({ element: child, index });
                // Обновляем высоту текущей колонки
                const element = elements.find((item) => item.index === index);
                const elementHeight = element?.element.getBoundingClientRect().height;
                columnHeights[columnIndex] += elementHeight || 0;
              }
              // При выключенном автопозиционировании
            } else {
              content[index % countColumns].push({ element: child, index });
            }
          }
        });
      }

      return content;
    }, [children, reverse, currentColumns, elements]);

    const addElement = (element: HTMLDivElement, index: number) => {
      if (!disableAlign && elements.length < content.flat().length) {
        setElements((prev) => [...prev, { element, index }]);
      }
    };

    return (
      <div ref={ref} style={{ display: 'flex', ...style }} {...other}>
        {/* Добавляем колонки */}
        {content.map((items, index) => (
          <div key={index} style={{ flex: 1, paddingLeft: index && currentGap }}>
            {/* Добавляем элементы */}
            {items.map((item, index) => (
              <div
                key={index}
                ref={(ref) => ref && addElement(ref, item.index)}
                style={{ paddingTop: index && currentGap }}
              >
                {item.element}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
) as <B extends { [key: string]: number }>(
  // eslint-disable-next-line no-unused-vars
  props: MasonryProps<B> & React.RefAttributes<HTMLDivElement>
) => JSX.Element;

export default Masonry;
