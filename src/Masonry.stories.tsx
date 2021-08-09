import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent, { MasonryProps } from './Masonry';

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => (
  <MasonryComponent {...args}>
    {[...new Array(5)].map((item, index) => (
      <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
        <p>Masonry {index + 1}</p>
      </div>
    ))}
  </MasonryComponent>
);

Masonry.args = {
  columns: { lg: 5, sm: 2 },
  breakpoints: { xl: 1536, lg: 1200, md: 900, sm: 600, xs: 0 },
};
