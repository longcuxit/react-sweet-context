# React SweetContext

A lightweight, performant state management solution for React applications built with Bun and TypeScript.

## Overview

React SweetContext provides an efficient, minimal implementation of the store pattern for React applications. Designed to be lightweight and performant, it offers:

- **Immutable state management** with automatic equality checking
- **Context-based store access** for components
- **Automatic subscription handling** with `useSyncExternalStore`
- **Action creation support** with typed selectors
- **Shallow equality checking** for optimized re-renders
- **Zero dependencies** - built with React and TypeScript only

## Quick Start

### Creating a Store Context

```typescript
import { createSweetContext, createHook } from "react-sweet-context";

// Define your state type
type User = {
  id: number;
  name: string;
  email: string;
};

// Define initial state
const initialState: User = {
  id: 0,
  name: "guest",
  email: "",
};

// Create the context
const userContext = createSweetContext({
  name: "UserContext", // Optional name for debugging
  initState: initialState,
  action: ({ set }) => ({
    updateName: (name: string) => {
      set({ name });
    },
    updateEmail: (email: string) => {
      set({ email });
    },
    resetUser: () => {
      set(initialState);
    },
  }),
});

// Create the hook for component usage
export const useUser = createHook(userContext);
```

### Using in Components

```typescript
import { useUser } from "./stores/UserStore";

function UserProfile() {
  const [user, actions] = useUser();

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => actions.updateName("New Name")}>
        Update Name
      </button>
      <button onClick={() => actions.updateEmail("new@email.com")}>
        Update Email
      </button>
    </div>
  );
}
```

## API Reference

### `createSweetContext(props)`

Create a lightweight store instance that is the default value of the context; each time a Container is rendered, a new store instance will be created.

**Parameters:**

- `props` - Configuration object with:
  - `name?`: Optional name for debugging
  - `initState`: Initial state value to be used for the store
  - `action`: Action creator function that returns action methods for the store

### `createHook(context, selector)`

Creates a React hook that provides access to store state and actions.

**Parameters:**

- `context`: The store context created by `createSweetContext`
- `selector?`: Optional function to extract specific values from state

### `createAction(context, selector)`

Creates a React hook that provides access to store actions without subscribing to state changes.

**Parameters:**

- `context`: The context created by `createSweetContext`
- `selector?`: Optional function to extract specific action methods from the store

### `createConsumer(context, selector)`

Creates a React Consumer component that provides access to store state and actions.

**Parameters:**

- `context`: The context created by `createSweetContext`
- `selector?`: Optional function to extract specific values from state

### `createContainer(context, config)`

Creates a React component that provides access to store state and actions.

**Parameters:**

- `context`: The context created by `createSweetContext`
- `config?`: Optional configuration object for container lifecycle events

**Configuration Object:**

The `config` parameter allows you to hook into the container's lifecycle events:

- `onInit?(api, action, props)`: Called when the container is initialized. Receives:

  - `api`: The store API for state manipulation
  - `action`: The action methods for the store
  - `props`: The container's props

- `onUpdate?(api, action, props, prev)`: Called when the container's props are updated. Receives:
  - `api`: The store API for state manipulation
  - `action`: The action methods for the store
  - `props`: The new props
  - `prev`: The previous props

**Returns:**

- A React component that wraps children with store provider

## Installation

```bash
bun install react-sweet-context
```

## Performance Considerations

### Shallow Equality Checking

React SweetContext uses shallow equality checking to optimize re-renders:

```typescript
// The following will only trigger a re-render if the reference changes
const useUser = createHook(context);
```

### Custom Selectors

Use custom selectors to extract only necessary data:

```typescript
// Only re-renders when count changes, not the entire state object
const useCount = createHook(context, (state) => state.count);
```
