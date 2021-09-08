# react-flexible-masonry

This package is perfect for situations where the standard behavior of the `flex` css property is not suitable. If you need to arrange elements in order in several columns, and the placed elements have different heights, the `Masonry` component imported from this package will fit them on the page with the ability to determine the optimal position for each element.

[![NPM](https://img.shields.io/npm/v/react-flexible-masonry.svg)](https://www.npmjs.com/package/react-flexible-masonry)

## Installation

```bash
npm i react-flexible-masonry
```

## Unique properties

| Name         |            Type            | Default | Description                                                                                                                                                                                                       |
| ------------ | :------------------------: | :-----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| breakpoints  |           object           |         | Breakpoints for adaptive component tuning, where key is the name of the breakpoint, value is the number of pixels of minimum width (numeric value). Breakpoints work like `@media (min-width: ...)`.              |
| columns      |      number \| object      |    1    | The number of columns. If no value is specified or not found (in the case of breakpoints), items will be lined up in a single column.                                                                             |
| gap          | string \| number \| object |    0    | Indent between elements. It can take both a numeric and a string value available for the css property `padding`. If no value is specified or not found (in the case of breakpoints), items will be indented zero. |
| reverse      |          boolean           |  false  | Arranges items in reverse order. Useful if you need to display elements added to the end of an array at the top.                                                                                                  |
| disableAlign |          boolean           |  false  | Disables automatic positioning of elements. In this case, the elements will be placed strictly in order in each column.                                                                                           |

> Since the `Masonry` component is a `div` element, you can also pass any property available to the `div` element.

## Using

The package exports the default `Masonry` component. The `Masonry` component is a wrapper over the elements that need to be positioned. All you need is to set the necessary parameters for the `Masonry` component, after which the magic will start to work,

like this:

```jsx
import React from 'react';
import Masonry from 'react-flexible-masonry';
import articles from './articles'; // sample dataset

export default function Example() {
  return (
    <Masonry columns={5} gap={20}>
      {articles.map((item) => (
        <div key={item.id}>{item.text}</div>
      ))}
    </Masonry>
  );
}
```

In this example, we have created five columns with 20px spacing between items.

> The value of the `gap` property is the value for the css property of `padding`, so you can pass not only a numeric value, but also a string value comparable to the `padding` property, for example: `gap="2rem"`. If a numeric value is passed, the default unit will be `px`.

If we do not pass any values for these properties, the elements will be lined up in one column, and the indentation will be zero.

## Breakpoints

The `Masonry` component is responsive to the width of the browser window, so you can control the number of columns or the amount of padding between elements for different screen sizes. This behavior is easily customizable by passing the `breakpoints` property to the `Masonry` component. In this case, the `columns` and `gap` properties (if you want to make them responsive) should be passed as objects with keys equal to the keys of the `breakpoints` object.

Breakpoints will act like: `@media (min-width: ...)`.

For example:

```jsx
import React from 'react';
import Masonry from 'react-flexible-masonry';
import articles from './articles'; // sample dataset

const breakpoints = { mobile: 0, tablet: 900, desktop: 1600 };

export default function Example() {
  return (
    <Masonry
      breakpoints={breakpoints}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      gap={{ mobile: 20, tablet: 30, desktop: 40 }}
    >
      {articles.map((item) => (
        <div key={item.id}>{item.text}</div>
      ))}
    </Masonry>
  );
}
```

In this example, when the browser window width is from 0px to 900px (excluding 900px), the elements will be lined up in two columns with a 20px padding between the elements, from 900px to 1600px (excluding 1600px) - three columns with a 30px padding and from 1600px and above the values for the "desktop" breakpoint will be saved.

You can give breakpoints absolutely any name, which is especially useful if you already have breakpoints, then you can simply import your breakpoints and pass them to the component, while the order and number of breakpoints is absolutely not important, the component will automatically find the desired breakpoint.

You don't even need to include all the values for all breakpoints that are in the `breakpoints` object, for example, if you want the indentation to remain unchanged when the window is 900px wide (for example,"tablet"), just pass two values: `gap={{mobile: 20, tablet: 30}}`.

> If you set a minimum breakpoint greater than 0px, for example, 300px, then when the browser window is between 0px and 300px wide (not including 300px), the `columns` and `gap` properties will take on their default values.

## Automatic positioning

By default, the automatic positioning of elements is enabled in the `Masonry` component, which means that if the elements differ greatly in height relative to each other, the component will automatically determine for each element the column in which the element will be placed. Otherwise, we may have a situation in which one column is much higher than the others.

Let's take a look at a simple example **without** automatic positioning:

<img src="assets/masonry-without-align.png" alt="masonry-without-align" width="900" >

At first glance, nothing unusual and even logical, the elements are arranged alternately in each column from left to right, which can be seen by the numbering in the upper left corner of each element.

Let's now take a look at the same example, but this time **with** automatic positioning of elements:

<img src="assets/masonry-with-align.png" alt="masonry-with-align" width="900">

The size of the elements remains the same, however, we can see how the elements line up in optimal positions for themselves, while creating the most successful structure.

This behavior is not always necessary, as it entails additional recalculation of elements, which is why you can disable this option by passing the `disableAlign` property with the value `true`.

## License

MIT © [Nikolay Goncharuk](https://github.com/GoncharukBro)
