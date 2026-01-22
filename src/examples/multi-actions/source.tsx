import {
  createAction,
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

const useCounter = createHook(context);

export const Counter = () => {
  const [value, actions] = useCounter();
  return (
    <div className="inline-10">
      <button onClick={actions.decrease}>-</button>
      <button onClick={actions.increase}>+</button>
      <span>Value: {value}</span>
    </div>
  );
};

const useIncrease = createAction(context, (actions) => actions.increase);

export const Increase = () => {
  const increase = useIncrease();
  return <button onClick={increase}>+</button>;
};
