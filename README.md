# Solid Bottomsheet

![npm](https://img.shields.io/npm/v/solid-bottomsheet?flat) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/solid-bottomsheet?flat) ![GitHub](https://img.shields.io/github/license/karthikeyanranasthala/solid-bottomsheet?flat)

A light-weight Bottomsheet UI component for [Solid JS](https://www.solidjs.com/) with zero dependencies.

## Demo

- [CodeSandbox](https://codesandbox.io/s/solid-bottomsheet-rhu1vt?resolutionWidth=320&resolutionHeight=675&file=/src/App.tsx)

## Features

- Smooth animations
- Swipe down to close
- Predefined swipe down threshold to auto close
- Click/Touch outside (overlay) to close

![solid-bottomsheet](https://user-images.githubusercontent.com/7726029/183614467-d7d20449-1f6e-4ac0-9763-7ddf59194d27.gif)

## Installation

```
npm install solid-bottomsheet
```

## Example

```jsx
// App.jsx

import "solid-bottomsheet/styles.css";
import { SolidBottomsheet } from "solid-bottomsheet";

const App = () => {
  const [isOpen, setOpen] = createSignal(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Click me!</button>
      {isOpen() && (
        <SolidBottomsheet onClose={() => setOpen(false)}>
          <p>I'm inside the bottomsheet</p>
        </SolidBottomsheet>
      )}
    </>
  );
};
```

## Todo

- (Docs) Add interactive example with stackblitz/codesandbox
- (Docs) Add examples to use the package with skypack and others
- (Feat) Make swipe down threshold configurable
- (Feat) Reduce overlay opacity on swipe down
- (Feat) Span points
- (Feat) Non-blocking view
