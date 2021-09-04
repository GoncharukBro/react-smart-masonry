import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent from '.';
import type { MasonryProps } from './Masonry';

const breakpoints = { mobile: 0, tablet: 900, desktop: 1600 };
const columns = 3;
const gap = { mobile: '20px', tablet: '40px', desktop: '60px' };

// eslint-disable-next-line no-unused-vars
const example = <MasonryComponent columns={columns} breakpoints={breakpoints} gap={gap} />;

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => {
  return (
    <MasonryComponent {...args} columns={columns} breakpoints={breakpoints} gap={gap}>
      {[...new Array(9)].map((item, index) => (
        <div key={index} style={{ padding: 16, boxShadow: '0 0 40px rgba(0, 0, 0, 0.25)' }}>
          <p style={{ margin: 0 }}>{index + 1}</p>
          <br />
          {index % columns === 0 ? (
            <p style={{ margin: 0 }}>
              Nisi sunt consectetur sunt aliqua. Aliqua commodo ullamco labore amet duis sit aliqua
              anim nisi anim aliqua magna est. Cupidatat laboris velit ea ipsum irure occaecat duis.
              In adipisicing aliquip sit do excepteur nostrud sit mollit aliquip ut sunt non. Amet
              aute qui ad labore ea proident eiusmod in amet. Aute exercitation nostrud ut sint
              ipsum. Irure aliquip aliquip quis qui aliqua. Eu laboris adipisicing dolore eiusmod
              incididunt proident excepteur est id. Tempor ea amet amet ad. Culpa et mollit
              consequat aliqua incididunt veniam laboris. Non cillum ea est est. Veniam velit et
              irure cillum in nulla mollit esse commodo esse amet id minim. Exercitation dolore
              laboris ullamco commodo voluptate laborum sint anim velit nostrud esse nostrud. Non
              cillum pariatur eu consectetur non id cillum dolore. Nulla irure laborum reprehenderit
              consequat eiusmod ea non voluptate commodo nostrud aliqua qui dolor. Ad qui labore
              ullamco est cupidatat aute aliqua est exercitation. Aute eiusmod quis magna
              exercitation nulla fugiat incididunt aute magna laboris enim. Nostrud aute ex eiusmod
              eiusmod excepteur eiusmod labore sunt consequat irure. Cupidatat occaecat adipisicing
              reprehenderit velit laboris voluptate elit nostrud ipsum nostrud cillum voluptate ex.
              Cupidatat laborum nisi mollit laboris ex aute. Officia magna ut enim ullamco do ad
              velit et. Adipisicing aliqua sit veniam proident cupidatat nulla irure. Anim sunt anim
              nostrud ullamco ipsum qui occaecat. Nulla voluptate Lorem aliquip et. Eiusmod nulla
              culpa adipisicing pariatur magna. Occaecat culpa sunt magna non adipisicing
              consectetur magna. Id elit magna ipsum cupidatat minim.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Ad irure nulla velit in qui nostrud ut pariatur qui irure labore dolor esse enim.
              Ipsum minim consectetur labore voluptate deserunt laborum velit proident esse sint
              sint.
            </p>
          )}
        </div>
      ))}
    </MasonryComponent>
  );
};

Masonry.args = {};
