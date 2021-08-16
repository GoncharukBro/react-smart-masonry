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
    breakpoints={{ mobile: 0, tablet: 900, desktop: 1536 }}
    columns={{ tablet: 4 }}
    // gap={{ tablet: 40 }}
  >
    {[...new Array(5)].map((item, index) => (
      <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
        <p>Masonry {index + 1}</p>
      </div>
    ))}
  </MasonryComponent>
);

Masonry.args = {};
