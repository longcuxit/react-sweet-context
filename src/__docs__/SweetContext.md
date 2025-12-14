# SweetContext Documentation

A lightweight React store implementation with minimal dependencies, designed for efficient state management in React applications.

## Overview

SweetContext provides a custom implementation of the store pattern that offers:
- Immutable state management
- Automatic subscription handling with `useSyncExternalStore`
- Context-based store access for components
- Action creation support with typed selectors
- Shallow equality checking for optimization

## Quick Start

### Creating a Store

```typescript
import { createSweetContext, createHook } from "react-sweet-context";

// Define your state type
type User = {
  id: number;
  name: string;
};

// Define initial state
const initialState: User = {
  id: 0,
  name: "guest"
};

// Create the store
const store = createSweetContext({
  name: "UserStore", // Optional name for debugging
  initState: initialState,
  action: ({ set }) => ({
    updateName: (name: string) => {
      set({ name });
    },
    resetUser: () => {
      set(initialState);
    }
  }),
});

// Create the hook for component usage
export const useUser = createHook(store);
```

### Using in Components

```typescript
import { useUser } from "./stores/UserStore";

function UserProfile() {
  const [user, actions] = useUser();
  
  return (
    <div>
      <p>Name: {user.name}</p>
      <button onClick={() => actions.updateName("New Name")}>
        Update Name
      </button>
    </div>
  );
}
```

## API Reference

### `createSweetContext(props)`

Creates a new lightweight store instance.

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

### `createContainer(context, config)`

Creates a React component that provides store context to its children.

**Parameters:**
- `context`: The store context
- `config?`: Configuration for container lifecycle events:
  - `onInit`: Called when container is initialized
  - `onUpdate`: Called when container props change

### `createConsumer(context, selector)`

Creates a React component that consumes store values and actions.

**Parameters:**
- `context`: The store context
- `selector?`: Optional function to extract specific values from state

### `createAction(context, selector)`

Creates a hook for accessing store actions with optional selector.

**Parameters:**
- `context`: The store context
- `selector?`: Optional function to select specific action methods

## Advanced Usage Patterns

### Store with Complex State

```typescript
import { createSweetContext, createHook } from "react-sweet-context";

type AppState = {
  loading: boolean;
  error: string | null;
  data: Record<string, any> | null;
};

const store = createSweetContext({
  name: "AppStore",
  initState: {
    loading: false,
    error: null,
    data: null
  },
  action: ({ set, get }) => ({
    setLoading: (loading: boolean) => {
      set({ loading });
    },
    setError: (error: string | null) => {
      set({ error });
    },
    setData: (data: Record<string, any> | null) => {
      set({ data });
    },
    reset: () => {
      set({
        loading: false,
        error: null,
        data: null
      });
    }
  }),
});

export const useApp = createHook(store);
```

### Store with Async Actions

```typescript
import { createSweetContext, createHook } from "react-sweet-context";

type User = {
  id: number;
  name: string;
};

const store = createSweetContext({
  name: "Auth",
  initState: {
    isLoggedIn: false,
    user: null as User | null
  },
  action: ({ set }) => ({
    async login(call: () => Promise<User>) {
      const user = await call();
      set({ isLoggedIn: true, user });
    },
    async logout() {
      // Simulate logout
      set({ isLoggedIn: false, user: null });
    }
  }),
});

export const useAuth = createHook(store);
```

### Store with Custom Selectors

```typescript
import { createSweetContext, createHook } from "react-sweet-context";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const store = createSweetContext({
  name: "Todos",
  initState: {
    todos: [] as Todo[],
    filter: "all" as "all" | "active" | "completed"
  },
  action: ({ set, get }) => ({
    addTodo: (text: string) => {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false
      };
      set(state => ({
        todos: [...state.todos, newTodo]
      }));
    },
    toggleTodo: (id: number) => {
      set(state => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      }));
    },
    setFilter: (filter: "all" | "active" | "completed") => {
      set({ filter });
    }
  }),
});

// Create custom selector for filtered todos
const useFilteredTodos = createHook(store, (state) => {
  const { todos, filter } = state;
  
  switch (filter) {
    case "active":
      return todos.filter(todo => !todo.completed);
    case "completed":
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
});

export { useFilteredTodos };
```

## Best Practices

### 1. Type Safety
Always define TypeScript interfaces for your state to ensure type safety:

```typescript
type MyState = {
  count: number;
  name: string;
  items: string[];
};
```

### 2. Immutable Updates
Use the `set` function with object spread to maintain immutability:

```typescript
// Good - maintains immutability
set({ count: state.count + 1 });

// Also good - function-based updates
set((prevState) => ({ count: prevState.count + 1 }));
```

### 3. Component Integration
Use the created hooks in components to access both state and actions:

```typescript
function Counter() {
  const [state, actions] = useCounter();
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={actions.increment}>Increment</button>
    </div>
  );
}
```

### 4. Error Handling
Implement proper error handling in your action functions:

```typescript
action: ({ set }) => ({
  async fetchData() {
    try {
      const data = await api.fetch();
      set({ data, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  }
})
```

## Performance Considerations

### 1. Shallow Equality Checking
SweetContext uses shallow equality checking to optimize re-renders:

```typescript
// The following will only trigger a re-render if the reference changes
const useUser = createHook(store);
```

### 2. Custom Selectors
Use custom selectors to extract only necessary data:

```typescript
// Only re-renders when count changes, not the entire state object
const useCount = createHook(store, (state) => state.count);
```

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from "vitest";
import { createSweetContext, createHook } from "../utils/SweetContext";

const store = createSweetContext({
  initState: { count: 0 },
  action: ({ set }) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
  }),
});

describe("SweetContext", () => {
  it("should create store with initial state", () => {
    const [state, actions] = useCounter();
    expect(state.count).toBe(0);
  });

  it("should increment count", () => {
    const [state, actions] = useCounter();
    actions.increment();
    expect(state.count).toBe(1);
  });
});
```

## Common Patterns

### 1. State Reset
```typescript
// In your action creator
reset: (defaultState) => {
  set(defaultState);
}
```

### 2. Conditional Updates
```typescript
// In your action creator
updateIf: (condition, update) => {
  if (condition) {
    set(update);
  }
}
```

### 3. Batch Updates
```typescript
// In your action creator
batchUpdate: (updates) => {
  set(updates);
}
```