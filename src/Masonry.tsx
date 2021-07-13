import { useState, useEffect, useMemo, Children } from 'react';

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const breakpoints: Record<Breakpoints, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };

type Columns = Partial<Record<Breakpoints, number>>;
type Gap = Partial<Record<Breakpoints, React.CSSProperties['marginLeft']>>;

interface Params {
  columns: number;
  gap: React.CSSProperties['marginLeft'];
}

export type MasonryProps = React.PropsWithChildren<{
  columns?: Columns;
  gap?: Gap;
}>;

export default function Masonry(props: MasonryProps) {
  const { children, columns: columnSize, gap: gapSize } = props;
  const [width, setWidth] = useState(window.innerWidth);
  const [params, setParams] = useState<Params>({ columns: 2, gap: 24 });

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

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    setParams((prev) => {
      if (width > breakpoints.xl) {
        return { columns: columnSize?.xl || prev.columns, gap: gapSize?.xl || prev.gap };
      }
      if (width > breakpoints.lg) {
        return { columns: columnSize?.lg || prev.columns, gap: gapSize?.lg || prev.gap };
      }
      if (width > breakpoints.md) {
        return { columns: columnSize?.md || prev.columns, gap: gapSize?.md || prev.gap };
      }
      if (width > breakpoints.sm) {
        return { columns: columnSize?.sm || prev.columns, gap: gapSize?.sm || prev.gap };
      }
      if (width > breakpoints.xs) {
        return { columns: columnSize?.xs || prev.columns, gap: gapSize?.xs || prev.gap };
      }
      return prev;
    });
  }, [width, columnSize, gapSize]);

  const columns = useMemo(() => {
    const array: JSX.Element[][] = [];

    // Устанавливаем дочерние элементы поочереди в каждую колонку
    Children.forEach(children, (child, index) => {
      const columnIndex = index % params.columns;

      if (!array[columnIndex]) {
        array[columnIndex] = [];
      }

      array[columnIndex].push(
        <div key={`masonry-item-${index + 1}`} style={{ marginBottom: params.gap }}>
          {child}
        </div>
      );
    });

    return array;
  }, [children, params.columns, params.gap]);

  return (
    <div style={{ display: 'flex' }}>
      {columns.map((column, index) => (
        <div
          key={`masonry-column-${index + 1}`}
          style={{ flex: 1, marginLeft: index > 0 ? params.gap : 0 }}
        >
          {column}
        </div>
      ))}
    </div>
  );
}
