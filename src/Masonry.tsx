import { useState, useEffect, useMemo, Children } from 'react';
import breakpoints from './breakpoints';
import { Columns, Gap } from './types';

export type MasonryProps = React.PropsWithChildren<
  Partial<Record<Columns, number> & Record<Gap, number>> & {}
>;

export default function Masonry(props: MasonryProps) {
  const { children, cxl = 2, clg, cmd, csm, cxs, gxl = 24, glg, gmd, gsm, gxs } = props;
  const [breakpoint, setBreakpoint] = useState(window.innerWidth);
  const [params, setParams] = useState({ columns: cxl, gap: gxl });

  // Записываем текущую ширину страницы
  useEffect(() => {
    const handleBreakpoint = () => setBreakpoint(window.innerWidth);
    window.addEventListener('resize', handleBreakpoint);
    return () => {
      window.removeEventListener('resize', handleBreakpoint);
    };
  }, []);

  // Устанавливаем параметры в зависимости от текущей ширины страницы
  useEffect(() => {
    setParams(() => {
      if (breakpoint > breakpoints.xl) {
        return { columns: cxl, gap: gxl };
      }
      if (breakpoint > breakpoints.lg) {
        return { columns: clg || cxl, gap: glg || gxl };
      }
      if (breakpoint > breakpoints.md) {
        return { columns: cmd || cxl, gap: gmd || gxl };
      }
      if (breakpoint > breakpoints.sm) {
        return { columns: csm || cxl, gap: gsm || gxl };
      }
      return { columns: cxs || cxl, gap: gxs || gxl };
    });
  }, [breakpoint, clg, cmd, csm, cxl, cxs, glg, gmd, gsm, gxl, gxs]);

  const columns = useMemo(() => {
    const array: JSX.Element[][] = [];

    // Устанавливаем дочерние элементы поочереди в каждую колонку
    Children.forEach(children, (item, index) => {
      const column = index % params.columns;

      if (!array[column]) {
        array[column] = [];
      }

      array[column].push(
        <div key={`masonry-column-item-${index + 1}`} style={{ marginBottom: params.gap }}>
          {item}
        </div>
      );
    });

    return array;
  }, [children, params.columns, params.gap]);

  return (
    <div style={{ display: 'flex' }}>
      {columns.map((item, index) => (
        <div
          key={`masonry-column-${index + 1}`}
          style={{
            flex: 1,
            marginLeft: index > 0 ? params.gap : 0,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
