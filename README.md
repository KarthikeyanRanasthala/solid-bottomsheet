# Solid Bottomsheet

![npm](https://img.shields.io/npm/v/solid-bottomsheet?flat) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/solid-bottomsheet?flat) ![GitHub](https://img.shields.io/github/license/karthikeyanranasthala/solid-bottomsheet?flat)

## Installation

```
// npm
npm install solid-bottomsheet

// yarn
yarn add solid-bottomsheet
```

## Example

```jsx
// App.jsx

import "solid-bottomsheet/styles.css"
import { SolidBottomsheet } from "solid-bottomsheet"

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

