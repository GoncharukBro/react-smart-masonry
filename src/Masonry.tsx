import { useState, useEffect, useMemo, Children } from 'react';
import breakpoints from './breakpoints';
import { Columns, Gap } from './types';

export type MasonryProps = React.PropsWithChildren<
  Partial<Record<Columns, number> & Record<Gap, number>> & {}
>;

export default function Masonry(props: MasonryProps) {
  const { children, cxl = 2, clg, cmd, csm, cxs, gxl = 24, glg, gmd, gsm, gxs } = props;
  const [width, setWidth] = useState(window.innerWidth);
  const [params, setParams] = useState({ columns: cxl, gap: gxl });

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
        return { columns: cxl || cxl, gap: gxl || gxl };
      }
      if (width > breakpoints.lg) {
        return { columns: clg || cxl, gap: glg || gxl };
      }
      if (width > breakpoints.md) {
        return { columns: cmd || cxl, gap: gmd || gxl };
      }
      if (width > breakpoints.sm) {
        return { columns: csm || cxl, gap: gsm || gxl };
      }
      if (width > breakpoints.xs) {
        return { columns: cxs || cxl, gap: gxs || gxl };
      }
      return prev;
    });
  }, [width, clg, cmd, csm, cxl, cxs, glg, gmd, gsm, gxl, gxs]);

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
