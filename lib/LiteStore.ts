/* eslint-disable react-hooks/exhaustive-deps */
/**
 * A lightweight React store implementation with minimal dependencies.
 *
 * This file provides the core functionality for creating and managing
 * React stores using a custom implementation of the store pattern.
 *
 * Features:
 * - Immutable state management
 * - Automatic subscription handling with useSyncExternalStore
 * - Context-based store access for components
 * - Action creation support with typed selectors
 * - Shallow equality checking for optimization
 *
 * @module LiteStore
 */

import {
  Component,
  createContext,
  createElement,
  useContext,
  useMemo,
  useSyncExternalStore,
  type Context,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { ValueChanged } from "./ValueChanged";

// Local function implementation
function isPlainObject(value: any): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return !prototype || prototype === Object.prototype;
}


/**
 * Type for determining the return type of state selectors.
 */
type ShouldReturn<S> = S extends Record<string, unknown> ? Partial<S> : S;

/**
 * Type for state update actions.
 */
type SetStateAction<S> = ShouldReturn<S> | ((prevState: S) => ShouldReturn<S>);

/**
 * Configuration for store container lifecycle events.
 */
type LiteStoreContainerConfig<S, A, P = object> = {
  onInit?(api: LiteStoreApi<S>, action: A, props: P): void;
  onUpdate?(api: LiteStoreApi<S>, action: A, props: P, prev: P): void;
};

/**
 * Selector function type for extracting values from state.
 */
type StateSelector<S, V, Args extends unknown[] = []> = (
  state: S,
  ...args: Args
) => V;


export type StoreContext<S, A> = Context<StoreInstance<S, A>>
export type StoreState<S> = S extends StoreContext<infer S, unknown> ? S : never
export type StoreAction<S> = S extends StoreContext<unknown, infer A> ? A : never

/**
 * API interface for interacting with store state and actions.
 */
export type LiteStoreApi<S> = {
  /**
   * Get the current state value.
   * @returns The current state
   */
  get(): S;

  /**
   * Update the store state.
   * @param state - New state or function to compute new state
   */
  set: (state: SetStateAction<S>) => void;
};

/**
 * Configuration for creating a new store instance.
 */
export type LiteStoreProps<S, A> = {
  /**
   * Optional name for the store (used for debugging).
   */
  name?: string;

  /**
   * Initial state value to be used for the store.
   */
  initState: S;

  /**
   * Action creator function that returns action methods for the store.
   */
  action: (api: LiteStoreApi<S>, initState: S) => A;
};

/**
 * Creates a deep copy of the provided value.
 * @param source - The value to be copied
 * @returns A copy of the provided value
 */
function copyVariable<S>(source: S): S {
  if (isPlainObject(source)) return { ...source };
  return source;
}

/**
 * Default selector that returns the entire state.
 */
function selfSelector<S, V = S, Args extends unknown[] = []>(
  source: S,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: Args
): V {
  return source as unknown as V;
}

/**
 * Gets the actual state value from a state update action.
 */
function getActionState<S>(state: SetStateAction<S>, value: S) {
  return state instanceof Function ? state(value) : state;
}

/**
 * Internal class that manages store data and subscriptions.
 */
class StoreInstance<S, A> extends ValueChanged<S> {
  readonly action!: A;
  readonly api!: LiteStoreApi<S>;

  constructor({ initState, action }: LiteStoreProps<S, A>) {
    const state = copyVariable(initState);
    super(state);

    const setValue = (value: S) => (this.value = value);

    this.api = {
      get: () => this.value,
      set: isPlainObject(initState)
        ? (state) =>
          setValue({ ...this.value, ...getActionState(state, this.value) })
        : (state) => setValue(getActionState(state, this.value) as S),
    };

    this.action = action(this.api, state);
  }
}

/**
 * Helper function to create a named identifier for components.
 */
function shouldNamed(name: string, prefix: string) {
  return `${name}.${prefix}`;
}

/**
 * Performs shallow equality comparison between two objects.
 */
function shallowEqual<T extends {}>(
  objA: T,
  objB: T,
  ignoreKeys: (keyof T)[] = []
): boolean {
  const keys = (Object.keys(objA) as (keyof T)[]).filter((key) => !ignoreKeys.includes(key));

  for (const key of keys) {
    if (objA[key] !== objB[key]) return false;
  }

  return true;
}

const storeProps = new WeakMap();

/**
 * Creates a new lightweight store instance with the provided configuration.
 *
 * @param props - Configuration for creating the store
 * @returns Store API with methods to create containers, consumers and hooks
 */
export function createLiteStore<S, A>(props: LiteStoreProps<S, A>
) {
  /**
   * Creates an instance of the store with the provided configuration.
   */

  props.name = props.name || "LiteStore";
  props.initState = Object.freeze(props.initState);

  const Context = createContext(new StoreInstance(props));
  Context.displayName = props.name;

  storeProps.set(Context, Object.freeze(props))
  return Context
}


export function createContainer<S, A, P extends Record<string, unknown>>(context: StoreContext<S, A>,
  config: LiteStoreContainerConfig<S, A, P> = {}
) {
  class Container extends Component<PropsWithChildren<P>> {
    static displayName = shouldNamed(context.displayName!, "Container");

    instance = new StoreInstance<S, A>(storeProps.get(context));

    constructor(props: P) {
      super(props);
      if (config.onInit) {
        config.onInit(this.instance.api, this.instance.action, props);
      }
    }

    override shouldComponentUpdate(nextProps: Readonly<P>): boolean {
      if (!config.onUpdate) return false;
      if (shallowEqual(this.props, nextProps, ["children"])) return false;

      config.onUpdate!(
        this.instance.api,
        this.instance.action,
        nextProps,
        this.props
      );
      return true;
    }

    override render(): ReactNode {
      return createElement(
        context.Provider,
        { value: this.instance },
        this.props.children
      );
    }
  }

  return Container;
}
/**
 * create a hook that provides access to store state and actions.
 * 
 * @param context - is context of store
 * @param selector - optional function that returns selcted state
 * @returns [state, actions]
 */

export function createHook<S, A, V = S, Args extends unknown[] = []>(context: StoreContext<S, A>, selector: StateSelector<S, V, Args> = selfSelector) {
  return function useStore(...args: Args): [V, A] {
    const instance = useContext(context);
    const value = useSyncExternalStore(
      instance.listen.bind(instance),
      () => selector(instance.value, ...args)
    );

    return [value, instance.action];
  };
}


/**
 * create a useAction to access action of store no listen change rerender
 * 
 * @param context - is context of store
 * @param selector - optional function that returns selcted action
 * @returns 
 */
export function createAction<S, A, R = A, Args extends readonly unknown[] = []>(context: StoreContext<S, A>, selector?: (action: A, ...args: Args) => R): (...args: Args) => R {
  if (!selector) return () => selfSelector(useContext(context).action);

  return function useAction(...args: Args): R {
    const instance = useContext(context);
    return useMemo(() => selector(instance.action, ...args), args);
  };
}

export function createConsumer<S, A, V = S>(context: StoreContext<S, A>, selector: (state: S) => V = selfSelector) {
  const Consumer: FC<{
    children: (state: V, action: A) => ReactNode;
  }> = ({ children }) => {
    const instance = useContext(context);
    const value = useSyncExternalStore(
      instance.listen.bind(instance),
      () => selector(instance.value)
    );

    return children(value, instance.action);
  };

  Consumer.displayName = shouldNamed(context.displayName!, "Consumer");
  return Consumer;
}
