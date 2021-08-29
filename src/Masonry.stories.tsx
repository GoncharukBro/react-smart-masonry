import { ComponentStory, Meta } from '@storybook/react';
import MasonryComponent, { MasonryProps } from './Masonry';

function NewMasonry() {
  return (
    <MasonryComponent
      columns={{ tablet: 4 }}
      breakpoints={{ mobile: 0, tablet: 900, desktop: 1536 }}
      gap={{ tablet: 40 }}
    >
      {[...new Array(5)].map((item, index) => (
        <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
          <p>Masonry {index + 1}</p>
        </div>
      ))}
    </MasonryComponent>
  );
}

function NewMasonry3() {
  return (
    <MasonryComponent columns={{ tablet: 4 }} breakpoints={3} gap={{ tablet: 40 }}>
      {[...new Array(5)].map((item, index) => (
        <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
          <p>Masonry {index + 1}</p>
        </div>
      ))}
    </MasonryComponent>
  );
}

function NewMasonry2() {
  return (
    <MasonryComponent columns={{ tablet: 4 }} breakpoints={{}} gap={{ tablet: 40 }}>
      {[...new Array(5)].map((item, index) => (
        <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
          <p>Masonry {index + 1}</p>
        </div>
      ))}
    </MasonryComponent>
  );
}

function NewMasonry4() {
  return (
    <MasonryComponent
      columns={{ tablet: 4 }}
      // breakpoints={{ mobile: 0, tablet: 900, desktop: 1536 }}
      gap={{ tablet: 40 }}
    >
      {[...new Array(5)].map((item, index) => (
        <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
          <p>Masonry {index + 1}</p>
        </div>
      ))}
    </MasonryComponent>
  );
}

export default {
  title: 'Example',
  component: MasonryComponent,
  argTypes: {},
} as Meta<MasonryProps>;

export const Masonry: ComponentStory<typeof MasonryComponent> = (args) => {
  return (
    <MasonryComponent
      {...args}
      columns={{ tablet: 4 }}
      // breakpoints={{ mobile: 0, tablet: 900, desktop: 1536 }}
      gap={4}
    >
      {[...new Array(5)].map((item, index) => (
        <div key={`example-${index + 1}`} style={{ height: 100, background: 'red' }}>
          <p style={{ margin: 0 }}>Masonry {index + 1}</p>
        </div>
      ))}
    </MasonryComponent>
  );
};

Masonry.args = {};
