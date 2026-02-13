# react-sweet-context

A lightweight React state management library built on Context API and `useSyncExternalStore`.

[![npm version](https://img.shields.io/npm/v/react-sweet-context)](https://www.npmjs.com/package/react-sweet-context)
[![license](https://img.shields.io/npm/l/react-sweet-context)](https://github.com/longcuxit/react-sweet-context/blob/main/LICENSE)

## Features

- 🪶 **Lightweight** — Tiny bundle size, zero dependencies
- 🔒 **Type-safe** — Full TypeScript support with type inference
- ⚡ **Optimized** — Built on `useSyncExternalStore` with selector support to minimize re-renders
- 🧩 **Flexible** — Supports hooks, consumers, actions, and multiple store instances
- 📦 **Simple API** — Minimal boilerplate to get started

## Installation

```bash
npm install react-sweet-context
# or
bun add react-sweet-context
```

## Quick Start

```tsx
import {
  createSweetContext,
  createContainer,
  createHook,
  createAction,
} from "react-sweet-context";

// 1. Create a store
const CounterContext = createSweetContext({
  name: "Counter",
  initState: { count: 0 },
  action: (api) => ({
    increment: () => api.set((prev) => ({ count: prev.count + 1 })),
    decrement: () => api.set((prev) => ({ count: prev.count - 1 })),
  }),
});

// 2. Create a container (provider)
const CounterContainer = createContainer(CounterContext);

// 3. Create hooks
const useCounter = createHook(CounterContext);
const useCounterAction = createAction(CounterContext);

// 4. Use in components
function Counter() {
  const [state, actions] = useCounter();
  return (
    <div>
      <span>{state.count}</span>
      <button onClick={actions.increment}>+</button>
      <button onClick={actions.decrement}>-</button>
    </div>
  );
}

function App() {
  return (
    <CounterContainer>
      <Counter />
    </CounterContainer>
  );
}
```

## API

| Function | Description |
|----------|-------------|
| `createSweetContext({ name, initState, action })` | Create a new store context |
| `createContainer(context, config?)` | Create a Provider component with optional `onInit` / `onUpdate` lifecycle |
| `createHook(context, selector?)` | Create a hook that returns `[state, actions]` with optional selector |
| `createAction(context, selector?)` | Create a hook that returns actions only (no state subscription, no re-render) |
| `createConsumer(context, selector?)` | Create a render-prop Consumer component |

## Examples

Live examples are available at the [**homepage**](https://longcuxit.github.io/react-sweet-context/):

| Example | Description | Link |
|---------|-------------|------|
| **Simple Less** | Basic store with `createHook`, `createAction`, and `createConsumer` | [Demo](https://longcuxit.github.io/react-sweet-context/simple-less) |
| **Async Action** | Handling asynchronous operations in actions | [Demo](https://longcuxit.github.io/react-sweet-context/async-action) |
| **Multi Actions** | Using multiple action creators with selector | [Demo](https://longcuxit.github.io/react-sweet-context/multi-actions) |
| **Multi States** | Object state with selected state via `createHook` selector | [Demo](https://longcuxit.github.io/react-sweet-context/multi-states) |
| **Multi Instance** | Multiple independent store instances using `createContainer` | [Demo](https://longcuxit.github.io/react-sweet-context/multi-instance) |

## License

[MIT](https://github.com/longcuxit/react-sweet-context/blob/main/LICENSE)
