# React Lite Store

A lightweight, performant state management solution for React applications built with Bun and TypeScript.

## Overview

React Lite Store provides an efficient, minimal implementation of the store pattern for React applications. Designed to be lightweight and performant, it offers:

- **Immutable state management** with automatic equality checking
- **Context-based store access** for components
- **Automatic subscription handling** with `useSyncExternalStore`
- **Action creation support** with typed selectors
- **Shallow equality checking** for optimized re-renders
- **Zero dependencies** - built with React and TypeScript only

## Quick Start

### Creating a Store

```typescript
import { createLiteStore, createHook } from "react-lite-store";

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
  email: ""
};

// Create the store
const userStore = createLiteStore({
  name: "UserStore", // Optional name for debugging
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
    }
  }),
});

// Create the hook for component usage
export const useUser = createHook(userStore);
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

### `createLiteStore(props)`

Creates a new lightweight store instance.

**Parameters:**
- `props` - Configuration object with:
  - `name?`: Optional name for debugging
  - `initState`: Initial state value to be used for the store
  - `action`: Action creator function that returns action methods for the store

### `createHook(context, selector)`

Creates a React hook that provides access to store state and actions.

**Parameters:**
- `context`: The store context created by `createLiteStore`
- `selector?`: Optional function to extract specific values from state

### `createAction(context, selector)`

Creates a React hook that provides access to store actions without subscribing to state changes.

**Parameters:**
- `context`: The store context created by `createLiteStore`
- `selector?`: Optional function to extract specific action methods from the store

### `createConsumer(context, selector)`

Creates a React Consumer component that provides access to store state and actions.

**Parameters:**
- `context`: The store context created by `createLiteStore`
- `selector?`: Optional function to extract specific values from state

## Installation

```bash
bun install react-lite-store
```

## Performance Considerations

### Shallow Equality Checking
React Lite Store uses shallow equality checking to optimize re-renders:

```typescript
// The following will only trigger a re-render if the reference changes
const useUser = createHook(store);
```

### Custom Selectors
Use custom selectors to extract only necessary data:

```typescript
// Only re-renders when count changes, not the entire state object
const useCount = createHook(store, (state) => state.count);
