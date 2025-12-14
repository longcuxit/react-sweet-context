// src/Notifier.ts
var Notifier = class {
  /**
   * An array of listener functions that will be called when the notify method is invoked.
   * @private
   */
  _listeners = [];
  /**
   * Notifies all listeners by calling their respective callback functions.
   * @protected
   */
  notify(...args) {
    if (!this._listeners.length) return;
    this._listeners.slice(0).forEach((listener) => listener.apply(this, args));
  }
  /**
   * Adds a new listener to the notifier and returns a function that can be used to remove the listener later.
   * @param listener The listener function to add.
   * @returns A function that removes the listener when called.
   */
  listen(listener) {
    this._listeners.push(listener);
    return () => this.unListen(listener);
  }
  /**
   * Removes a listener from the notifier.
   * @param listener The listener function to remove.
   */
  unListen(listener) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
  /**
   * Clears all listeners from the listener array.
   */
  dispose() {
    this._listeners.length = 0;
  }
};

// src/ValueChanged.ts
var ValueChanged = class extends Notifier {
  _value;
  /**
   * Sets a new value for this instance, and notifies all observers if the value has changed.
   * @param newValue The new value to set.
   */
  set value(newValue) {
    if (newValue === this._value) return;
    this.notify(this._value = newValue);
  }
  setValue(newValue) {
    this.value = newValue;
  }
  /**
   * Gets the current value of this instance.
   * @returns The current value.
   */
  get value() {
    return this._value;
  }
  /**
   * Creates a new instance with an initial value and attaches it to a notifier.
   * @param initValue The initial value for this instance.
   */
  constructor(initValue) {
    super();
    this._value = initValue;
  }
};

// src/SweetContext.ts
import {
  Component,
  createContext,
  createElement,
  useContext,
  useMemo,
  useSyncExternalStore
} from "react";
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return !prototype || prototype === Object.prototype;
}
function copyVariable(source) {
  if (isPlainObject(source)) return { ...source };
  return source;
}
function selfSelector(source, ..._args) {
  return source;
}
function getActionState(state, value) {
  return state instanceof Function ? state(value) : state;
}
var StoreInstance = class extends ValueChanged {
  action;
  api;
  constructor({ initState, action }) {
    const state = copyVariable(initState);
    super(state);
    const setValue = (value) => this.value = value;
    this.api = {
      get: () => this.value,
      set: isPlainObject(initState) ? (state2) => setValue({ ...this.value, ...getActionState(state2, this.value) }) : (state2) => setValue(getActionState(state2, this.value))
    };
    this.action = action(this.api, state);
  }
};
function shouldNamed(name, prefix) {
  return `${name}.${prefix}`;
}
function shallowEqual(objA, objB, ignoreKeys = []) {
  const keys = Object.keys(objA).filter(
    (key) => !ignoreKeys.includes(key)
  );
  for (const key of keys) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}
var Inject = class extends Notifier {
  emit(instance) {
    this.notify(instance);
  }
};
var injects = {
  hook: new Inject(),
  action: new Inject(),
  container: new Inject(),
  consumer: new Inject()
};
var storeProps = /* @__PURE__ */ new WeakMap();
function createSweetContext(props) {
  props.name = props.name || "SweetContext";
  props.initState = Object.freeze(props.initState);
  const Context = createContext(new StoreInstance(props));
  Context.displayName = props.name;
  storeProps.set(Context, Object.freeze(props));
  return Context;
}
function createContainer(context, config = {}) {
  class Container extends Component {
    static displayName = shouldNamed(context.displayName, "Container");
    instance = new StoreInstance(storeProps.get(context));
    constructor(props) {
      super(props);
      if (config.onInit) {
        config.onInit(this.instance.api, this.instance.action, props);
      }
      injects.container.emit(this.instance);
    }
    shouldComponentUpdate(nextProps) {
      if (!config.onUpdate) return false;
      if (shallowEqual(this.props, nextProps, ["children"])) return false;
      config.onUpdate(
        this.instance.api,
        this.instance.action,
        nextProps,
        this.props
      );
      return true;
    }
    render() {
      return createElement(
        context.Provider,
        { value: this.instance },
        this.props.children
      );
    }
  }
  return Container;
}
function createHook(context, selector = selfSelector) {
  return function useStore(...args) {
    const instance = useContext(context);
    const value = useSyncExternalStore(
      instance.listen.bind(instance),
      () => selector(instance.value, ...args)
    );
    injects.hook.emit(instance);
    return [value, instance.action];
  };
}
function createAction(context, selector) {
  if (!selector)
    return () => {
      const instance = useContext(context);
      injects.action.emit(instance);
      return selfSelector(instance.action);
    };
  return function useAction(...args) {
    const instance = useContext(context);
    injects.action.emit(instance);
    return useMemo(() => selector(instance.action, ...args), args);
  };
}
function createConsumer(context, selector = selfSelector) {
  const Consumer = ({ children }) => {
    const instance = useContext(context);
    const value = useSyncExternalStore(
      instance.listen.bind(instance),
      () => selector(instance.value)
    );
    injects.action.emit(instance);
    return children(value, instance.action);
  };
  Consumer.displayName = shouldNamed(context.displayName, "Consumer");
  return Consumer;
}
export {
  Notifier,
  ValueChanged,
  createAction,
  createConsumer,
  createContainer,
  createHook,
  createSweetContext,
  injects
};
