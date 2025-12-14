import { ReactNode } from "react";
import {
  createContainer,
  createHook,
  createSweetContext,
} from "react-sweet-context";

export const context = createSweetContext({
  initState: 0,
  action: ({ set, get }) => ({
    increase: () => set((old) => old + 1),
    decrease: () => set(get() - 1),
  }),
});

const Container = createContainer(context);

const useCounter = createHook(context);

const CounterContent = () => {
  const [value, actions] = useCounter();
  return (
    <div className="inline-10" style={{ marginBottom: 10 }}>
      <button onClick={actions.decrease}>-</button>
      <button onClick={actions.increase}>+</button>
      <span>Value: {value}</span>
    </div>
  );
};

export const Counter = ({ children }: { children?: ReactNode }) => {
  return (
    <Container>
      <CounterContent />
      {children}
    </Container>
  );
};

export const NestedCounters = () => {
  return (
    <>
      <span>Global:</span> <CounterContent />
      <span>Level 1:</span>
      <Counter>
        <span>Level 2:</span>
        <Counter />
      </Counter>
    </>
  );
};
