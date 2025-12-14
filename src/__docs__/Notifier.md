# Notifier Documentation

## Overview

`Notifier` is an abstract base class that provides a mechanism for observers to be notified when events occur. It's designed to be extended by other classes that need to notify listeners of changes or events.

## Features

- Observer pattern implementation
- Add/remove listeners
- Notify all listeners when an event occurs
- Disposal mechanism to clean up listeners
- Type-safe notification with generic arguments

## API Reference

### Constructor

```typescript
constructor()
```

Creates a new instance of `Notifier`.

### Methods

#### notify(...args: Args): void

Notifies all listeners by calling their respective callback functions.

**Parameters:**
- `args` (Args): Arguments to pass to each listener

#### listen(listener: NotifierListener<Args>): () => void

Adds a new listener to the notifier and returns a function that can be used to remove the listener later.

**Parameters:**
- `listener` (NotifierListener<Args>): The listener function to add

**Returns:**
- `() => void`: A function that removes the listener when called

#### unListen(listener: NotifierListener<Args>): void

Removes a listener from the notifier.

**Parameters:**
- `listener` (NotifierListener<Args>): The listener function to remove

#### dispose(): void

Clears all listeners from the notifier.

## Usage Examples

### Basic Usage

```typescript
import { Notifier } from "./Notifier";

class MyEventNotifier extends Notifier<[string, number]> {
  // Event notification method
  fireEvent(message: string, value: number) {
    this.notify(message, value);
  }
}

// Create an instance
const notifier = new MyEventNotifier();

// Add a listener
const removeListener = notifier.listen((message, value) => {
  console.log(`Received: ${message}, ${value}`);
});

// Fire an event
notifier.fireEvent("Hello", 42);

// Remove the listener
removeListener();
```

### Working with Multiple Listeners

```typescript
// Add multiple listeners
const listener1 = notifier.listen((message) => console.log(`Listener 1: ${message}`));
const listener2 = notifier.listen((message) => console.log(`Listener 2: ${message}`));

// Fire an event - both listeners will be notified
notifier.fireEvent("Test message");

// Remove one listener
listener1();
```

### Disposing of All Listeners

```typescript
// Add some listeners
notifier.listen(() => console.log("Listener 1"));
notifier.listen(() => console.log("Listener 2"));

// Remove all listeners at once
notifier.dispose();
```