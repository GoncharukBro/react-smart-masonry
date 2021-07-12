import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent, { MasonryProps } from './Masonry';

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => (
  <MasonryComponent {...args}>
    {[...new Array(20)].map((item, index) => (
      <div style={{ height: 100, background: 'red' }}>
        <p>Masonry {index + 1}</p>
      </div>
    ))}
  </MasonryComponent>
);

Masonry.args = {};
