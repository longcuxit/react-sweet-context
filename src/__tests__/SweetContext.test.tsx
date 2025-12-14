import { vi, afterEach, describe, expect, it } from "vitest";
import { createSweetContext, createAction, createHook, createConsumer, createContainer } from "../SweetContext";
import { act, render, renderHook } from "@testing-library/react";
import { createElement, useState } from "react";
import type {
  ComponentType,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";

export function createDynamicWrapper<P extends Record<string, unknown>>(
  iniProps: P,
  Wrapper: ComponentType<PropsWithChildren<P>>
) {
  let setWrapProps: Dispatch<SetStateAction<P>>;

  const DynamicWrapper = ({ children }: { children: ReactNode }) => {
    const [props, setProps] = useState(iniProps);
    setWrapProps = setProps;
    return createElement(Wrapper, props, children);
  };

  const updateProps = (props: Partial<P>) => {
    act(() => setWrapProps((p: P) => ({ ...p, ...props })));
  };

  return [DynamicWrapper, updateProps] as const;
}



describe("SweetContext: Less store", () => {
  const store = createSweetContext({
    initState: 0,
    action({ set, get }) {
      return () => set(get() + 1);
    },
  });

  const useCounter = createHook(store);
  const Container = createContainer(store);
  const Consumer = createConsumer(store);

  it("should increase state", () => {
    const { result } = renderHook(useCounter);
    expect(result.current[0]).toBe(0);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(1);
  });

  it("should render with Consumer", () => {
    let rs!: ReturnType<typeof useCounter>;
    render(
      <Container>
        <Consumer>
          {(state, action) => {
            rs = [state, action];
            return null;
          }}
        </Consumer>
      </Container>
    );

    expect(rs[0]).toBe(0);
    act(() => rs[1]());
    expect(rs[0]).toBe(1);
  });

  it("should multiple instances", () => {
    const [wrapper, updateWrapperProps] = createDynamicWrapper({}, Container);

    const { result: r1 } = renderHook(useCounter, {
      wrapper,
    });
    const { result: r2 } = renderHook(useCounter, {
      wrapper,
    });

    updateWrapperProps({});

    expect(r1.current[0]).toBe(0);
    expect(r2.current[0]).toBe(0);

    act(() => r1.current[1]());
    expect(r1.current[0]).toBe(1);
    expect(r2.current[0]).toBe(0);

    act(() => r2.current[1]());
    expect(r1.current[0]).toBe(1);
    expect(r2.current[0]).toBe(1);
  });
});

describe("SweetContext", () => {
  const initState = { count: 0, name: "test" };
  const store = createSweetContext({
    initState,
    action: ({ set, get }) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set({ count: get().count - 1 }),
      setName: (name: string) => set({ name }),
      reset: () => set(initState),
    }),
  });

  const useCounter = createHook(store);
  const useAction = createAction(store);
  const useActionSelector = createAction(store, (actions) => actions.increment);
  const Container = createContainer(store, {
    onInit: ({ set }, _, values) => set(values),
    onUpdate: ({ set }, _, values) => set(values),
  });

  afterEach(() => {
    const { result } = renderHook(useCounter);
    act(() => result.current[1].reset());
  });

  it("should create a store with initial state", () => {
    const { result } = renderHook(useCounter);
    expect(result.current[0].count).toBe(0);
    expect(result.current[0].name).toBe("test");
  });

  it("should increment the count", () => {
    const { result } = renderHook(useCounter);
    act(() => result.current[1].increment());
    expect(result.current[0].count).toBe(1);
    act(() => result.current[1].decrement());
    expect(result.current[0].count).toBe(0);
  });

  it("should Container with initial state", () => {
    const [wrapper] = createDynamicWrapper(
      { count: 2, name: "initialString" },
      Container
    );
    const { result } = renderHook(useCounter, {
      wrapper,
    });

    expect(result.current[0].count).toBe(2);
    expect(result.current[0].name).toBe("initialString");
  });

  it("should Container update new state", () => {
    const [wrapper, updateWrapperProps] = createDynamicWrapper(
      { count: 0, name: "test" },
      Container
    );
    const { result } = renderHook(useCounter, {
      wrapper,
    });

    act(() => {
      result.current[1].increment();
      result.current[1].increment();
    });
    expect(result.current[0].count).toBe(2);
    updateWrapperProps({ name: "name", count: 10 });
    expect(result.current[0].count).toBe(10);
    expect(result.current[0].name).toBe("name");
  });

  it("should Container skip update when the same props are passed", () => {
    const [wrapper, updateWrapperProps] = createDynamicWrapper(
      { count: 0, name: "test" },
      Container
    );
    const renderer = vi.fn().mockImplementation(useCounter);

    const { result } = renderHook(renderer, { wrapper });
    expect(renderer).toBeCalledTimes(1);
    act(() => {
      updateWrapperProps({ name: "name", count: 10 });
    });
    expect(result.current[0].count).toBe(10);
    expect(renderer).toBeCalledTimes(2);

    act(() => {
      updateWrapperProps({ name: "name", count: 10 });
    });
    expect(renderer).toBeCalledTimes(2);
  });

  it("should useAction skip render when state change", () => {
    const renderer = vi.fn().mockImplementation(useAction);
    const { result } = renderHook(renderer);
    expect(renderer).toBeCalledTimes(1);
    act(() => result.current.increment());
    expect(renderer).toBeCalledTimes(1);
  });

  it("should useAction with selector", () => {
    const renderer = vi.fn().mockImplementation(useActionSelector);
    const { result } = renderHook(renderer);
    expect(renderer).toBeCalledTimes(1);
    act(() => result.current());
    expect(renderer).toBeCalledTimes(1);
  });
});