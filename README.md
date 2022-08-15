# Solid Bottomsheet

![npm](https://img.shields.io/npm/v/solid-bottomsheet?flat) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/solid-bottomsheet?flat) ![GitHub](https://img.shields.io/github/license/karthikeyanranasthala/solid-bottomsheet?flat)

A light-weight, touch-interactive Bottomsheet UI component for [Solid JS](https://www.solidjs.com/) with zero dependencies.

## Features

- Two variants, `default` and `snap`
- A handle for touch interactions
- Swipe up/down to snap to configured snap points (for snap variant)
- Swipe down to close
- Predefined swipe down threshold to auto close (for default variant)
- Touch outside (overlay) of the bottomsheet to close
- Last but not the least, smooth transitions/animations

## Demo

[CodeSandbox](https://codesandbox.io/s/solid-bottomsheet-rhu1vt?resolutionWidth=320&resolutionHeight=675&file=/src/App.tsx) - Open the sandbox preview in new tab and switch to responsive mode to use touch for interactions

![solid-bottomsheet](https://user-images.githubusercontent.com/7726029/184683308-0e65d177-0361-4d2a-9d88-de8afaba94e1.gif)


## Installation

```
npm install solid-bottomsheet
```

## Props

|       Prop       |          Required           |                                 Value(s)                                 |
| :--------------: | :-------------------------: | :----------------------------------------------------------------------: |
|     variant      |             ✅              |                           `default` \| `snap`                            |
|     onClose      |             ✅              |                   A Function to close the bottomsheet                    |
|    snapPoints    | ✅ (when variant is `snap`) | A Function to return an Array of numbers which represent the snap points |
| defaultSnapPoint | ✅ (when variant is `snap`) |   A Function to return a number which represent the default snap point   |

## Examples

### Default Variant

```jsx
// App.jsx
import { createSignal } from "solid-js";

import "solid-bottomsheet/styles.css";
import { SolidBottomsheet } from "solid-bottomsheet";

const App = () => {
  const [isOpen, setOpen] = createSignal(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Click me!</button>
      {isOpen() && (
        <SolidBottomsheet variant="default" onClose={() => setOpen(false)}>
          <p>I'm inside the bottomsheet</p>
        </SolidBottomsheet>
      )}
    </>
  );
};
```

### Snap Variant

```jsx
// App.jsx

import { createSignal } from "solid-js";

import "solid-bottomsheet/styles.css";
import { SolidBottomsheet } from "solid-bottomsheet";

const App = () => {
  const [isOpen, setOpen] = createSignal(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Click me!</button>
      {isOpen() && (
        <SolidBottomsheet
          variant="snap"
          defaultSnapPoint={({ maxHeight }) => maxHeight / 2}
          snapPoints={({ maxHeight }) => [maxHeight, maxHeight / 4]}
          onClose={() => setOpen(false)}
        >
          <p>I'm inside the bottomsheet</p>
        </SolidBottomsheet>
      )}
    </>
  );
};
```

## Todo

- (Docs) Add examples to use the package with skypack and others
- (Feat) Make swipe down threshold configurable
- (Feat) Reduce overlay opacity on swipe down
- (Feat) Non-blocking view

## Links

- [Changelog](https://github.com/KarthikeyanRanasthala/solid-bottomsheet/blob/main/CHANGELOG.md)
- [GitHub](https://github.com/KarthikeyanRanasthala/solid-bottomsheet)
- [NPM](https://www.npmjs.com/package/solid-bottomsheet)
