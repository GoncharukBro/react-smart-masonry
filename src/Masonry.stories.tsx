import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent from '.';
import type { MasonryProps } from './Masonry';

const breakpoints = { mobile: 0, tablet: 900, desktop: 1600 };
const columns = { mobile: 1, tablet: 3, desktop: 5 };
const gap = { mobile: '20px', tablet: '40px', desktop: '60px' };

// eslint-disable-next-line no-unused-vars
const example = <MasonryComponent columns={columns} breakpoints={breakpoints} gap={gap} />;

function MyComponent({ index }: any) {
  return (
    <div key={index} style={{ padding: 16, boxShadow: '0 0 40px rgba(0, 0, 0, 0.25)' }}>
      <p style={{ margin: 0 }}>{index + 1}</p>
      <br />
      {index % 3 === 0 ? (
        <p style={{ margin: 0 }}>
          Nisi sunt consectetur sunt aliqua. Aliqua commodo ullamco labore amet duis sit aliqua anim
          nisi anim aliqua magna est. Cupidatat laboris velit ea ipsum irure occaecat duis. In
          adipisicing aliquip sit do excepteur nostrud sit mollit aliquip ut sunt non. Amet aute qui
          ad labore ea proident eiusmod in amet. Aute exercitation nostrud ut sint ipsum. Irure
          aliquip aliquip quis qui aliqua. Eu laboris adipisicing dolore eiusmod incididunt proident
          excepteur est id. Tempor ea amet amet ad. Culpa et mollit consequat aliqua incididunt
          veniam laboris. Cupidatat laboris velit ea ipsum irure occaecat duis. In adipisicing
          aliquip sit do excepteur nostrud sit mollit aliquip ut sunt non. Amet aute qui ad labore
          ea proident eiusmod in amet. Aute exercitation nostrud ut sint ipsum. Irure aliquip
          aliquip quis qui aliqua. Eu laboris adipisicing dolore eiusmod incididunt proident
          excepteur est id. Tempor ea amet amet ad. Culpa et mollit consequat aliqua incididunt
          veniam laboris.
        </p>
      ) : (
        <p style={{ margin: 0 }}>
          Ad irure nulla velit in qui nostrud ut pariatur qui irure labore dolor esse enim. Ipsum
          minim consectetur labore voluptate deserunt laborum velit proident esse sint sint.
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
    <MasonryComponent {...args} columns={columns} breakpoints={breakpoints} gap={gap}>
      {[...new Array(9)].map((item, index) => (
        <MyComponent key={index} index={index} />
      ))}
    </MasonryComponent>
  );
};

Masonry.args = {};
