import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent from '.';
import type { MasonryProps } from '.';

const breakpoints = { mobile: 0, tablet: 900, desktop: 1600 };
const columns = { mobile: 2, tablet: 3, desktop: 4 };
const gap = { mobile: '20px', tablet: '30px', desktop: '40px' };

// eslint-disable-next-line no-unused-vars
const example = <MasonryComponent columns={columns} breakpoints={breakpoints} gap={gap} />;

function MyComponent({ index }: any) {
  return (
    <div
      key={index}
      style={{ padding: 16, background: 'white', boxShadow: '0 0 40px rgba(0, 0, 0, 0.25)' }}
    >
      <p style={{ margin: 0 }}>{index + 1}</p>
      <br />
      {index === 0 || index === 2 ? (
        <p style={{ margin: 0 }}>
          Mollit elit reprehenderit do reprehenderit incididunt deserunt officia. Ut officia id sit
          adipisicing tempor duis tempor eu commodo nisi do. Non pariatur aliquip anim ullamco
          aliqua nulla. Ut dolor voluptate enim sunt quis anim veniam amet adipisicing duis deserunt
          aliquip incididunt. Commodo veniam minim ullamco veniam velit ut excepteur excepteur nisi.
          Quis eiusmod incididunt fugiat ipsum eiusmod adipisicing proident et. Non ullamco dolore
          proident ullamco nulla culpa ipsum enim. Amet est velit ea dolore dolor reprehenderit.
          Duis sit labore dolor quis magna dolor. Et minim duis laboris sunt. Nisi magna dolor
          voluptate labore veniam sunt excepteur sit labore fugiat nostrud nisi. Officia sit laborum
          ex velit cupidatat. Adipisicing nulla culpa culpa pariatur fugiat enim. Consequat ut elit
          eiusmod consectetur laboris id nulla aute ex reprehenderit.
        </p>
      ) : (
        <p style={{ margin: 0 }}>
          Labore aute voluptate deserunt dolore dolore nostrud laborum. Est sint officia eu elit
          aute eiusmod amet ullamco elit. Ut dolore ullamco quis duis. Amet nostrud nisi est fugiat
          dolore exercitation.
        </p>
      )}
    </div>
  );
}

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => {
  return (
    <MasonryComponent {...args} ref={(ref) => {}} columns={2} gap={20}>
      {[...new Array(4)].map((item, index) => (
        <MyComponent key={index} index={index} />
      ))}
    </MasonryComponent>
  );
};

Masonry.args = {};

export const ResponsiveMasonry: ComponentStory<typeof MasonryComponent> = (args) => {
  return (
    <MasonryComponent {...args} columns={columns} breakpoints={breakpoints} gap={gap} autoArrange>
      {[...new Array(7)].map((item, index) => (
        <MyComponent key={index} index={index} />
      ))}
    </MasonryComponent>
  );
};

ResponsiveMasonry.args = {};
