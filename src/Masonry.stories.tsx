import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent, { MasonryProps } from './Masonry';

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps<any>>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => (
  <MasonryComponent
    {...args}
    breakpoints={{ xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }}
    columns={{ xs: 1 }}
    gap={{ xs: 1 }}
  >
    {[...new Array(5)].map((item, index) => (
      <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
        <p>Masonry {index + 1}</p>
      </div>
    ))}
  </MasonryComponent>
);

Masonry.args = {};
