import * as react from 'react';
import { Context, PropsWithChildren, ReactNode } from 'react';

type NotifierListener<Args extends unknown[] = []> = (...args: Args) => void;
/**
 * A notifier class that allows listeners to be added and removed,
 * and notifies them when an event occurs.
 */
declare class Notifier<Args extends unknown[] = []> {
    /**
     * An array of listener functions that will be called when the notify method is invoked.
     * @private
     */
    private _listeners;
    /**
     * Notifies all listeners by calling their respective callback functions.
     * @protected
     */
    protected notify(...args: Args): void;
    /**
     * Adds a new listener to the notifier and returns a function that can be used to remove the listener later.
     * @param listener The listener function to add.
     * @returns A function that removes the listener when called.
     */
    listen(listener: NotifierListener<Args>): () => void;
    /**
     * Removes a listener from the notifier.
     * @param listener The listener function to remove.
     */
    unListen(listener: NotifierListener<Args>): void;
    /**
     * Clears all listeners from the listener array.
     */
    dispose(): void;
}

/**
 * A class that notifies observers when its value changes.
 */
declare class ValueChanged<T> extends Notifier<[T]> {
    private _value;
    /**
     * Sets a new value for this instance, and notifies all observers if the value has changed.
     * @param newValue The new value to set.
     */
    set value(newValue: T);
    setValue(newValue: T): void;
    /**
     * Gets the current value of this instance.
     * @returns The current value.
     */
    get value(): T;
    /**
     * Creates a new instance with an initial value and attaches it to a notifier.
     * @param initValue The initial value for this instance.
     */
    constructor(initValue: T);
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
type SweetContainerConfig<S, A, P = object> = {
    onInit?(api: SweetApi<S>, action: A, props: P): void;
    onUpdate?(api: SweetApi<S>, action: A, props: P, prev: P): void;
};
/**
 * Selector function type for extracting values from state.
 */
type StateSelector<S, V, Args extends unknown[] = []> = (state: S, ...args: Args) => V;
type StoreContext<S, A> = Context<StoreInstance<S, A>>;
type StoreState<S> = S extends StoreContext<infer S, unknown> ? S : never;
type StoreAction<S> = S extends StoreContext<unknown, infer A> ? A : never;
/**
 * API interface for interacting with store state and actions.
 */
type SweetApi<S> = {
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
type SweetStoreProps<S, A> = {
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
    action: (api: SweetApi<S>, initState: S) => A;
};
/**
 * Internal class that manages store data and subscriptions.
 */
declare class StoreInstance<S, A> extends ValueChanged<S> {
    readonly action: A;
    readonly api: SweetApi<S>;
    constructor({ initState, action }: SweetStoreProps<S, A>);
}
declare class Inject extends Notifier<[StoreInstance<any, any>]> {
    emit(instance: StoreInstance<any, any>): void;
}
declare const injects: {
    hook: Inject;
    action: Inject;
    container: Inject;
    consumer: Inject;
};
/**
 * Creates a new lightweight store instance with the provided configuration.
 *
 * @param props - Configuration for creating the store
 * @returns Store API with methods to create containers, consumers and hooks
 */
declare function createSweetContext<S, A>(props: SweetStoreProps<S, A>): Context<StoreInstance<S, A>>;
declare function createContainer<S, A, P extends Record<string, unknown>>(context: StoreContext<S, A>, config?: SweetContainerConfig<S, A, P>): {
    new (props: P): {
        instance: StoreInstance<S, A>;
        shouldComponentUpdate(nextProps: Readonly<P>): boolean;
        render(): react.FunctionComponentElement<react.ProviderProps<StoreInstance<S, A>>>;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<PropsWithChildren<P>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<PropsWithChildren<P>>;
        state: Readonly<{}>;
        componentDidMount?(): void;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: react.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<PropsWithChildren<P>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<PropsWithChildren<P>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<PropsWithChildren<P>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<PropsWithChildren<P>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<PropsWithChildren<P>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<PropsWithChildren<P>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    displayName: string;
    contextType?: Context<any> | undefined;
    propTypes?: any;
};
/**
 * create a hook that provides access to store state and actions.
 *
 * @param context - is context of store
 * @param selector - optional function that returns selcted state
 * @returns [state, actions]
 */
declare function createHook<S, A, V = S, Args extends unknown[] = []>(context: StoreContext<S, A>, selector?: StateSelector<S, V, Args>): (...args: Args) => [V, A];
/**
 * create a useAction to access action of store no listen change rerender
 *
 * @param context - is context of store
 * @param selector - optional function that returns selcted action
 * @returns
 */
declare function createAction<S, A, R = A, Args extends readonly unknown[] = []>(context: StoreContext<S, A>, selector?: (action: A, ...args: Args) => R): (...args: Args) => R;
declare function createConsumer<S, A, V = S>(context: StoreContext<S, A>, selector?: (state: S) => V): {
    ({ children }: {
        children: (state: V, action: A) => ReactNode;
    }): ReactNode;
    displayName: string;
};

export { Notifier, type NotifierListener, type StoreAction, type StoreContext, type StoreState, type SweetApi, type SweetStoreProps, ValueChanged, createAction, createConsumer, createContainer, createHook, createSweetContext, injects };
