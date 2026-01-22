import {
  createAction,
  createConsumer,
  createHook,
  createSweetContext,
} from "react-sweet-context";

export const context = createSweetContext({
  initState: false,
  action({ set }) {
    return () => set((oldState) => !oldState);
  },
});

const useToggle = createHook(context);

export const ToggleRender = () => {
  const [state, toggle] = useToggle();
  return <button onClick={toggle}>{state ? "On" : "Off"}</button>;
};

const useAction = createAction(context);

export const ToggleImunne = () => {
  const toggle = useAction();
  return <button onClick={toggle}>Toogle</button>;
};

const Consummer = createConsumer(context);
export const ToggleConsumer = () => {
  return (
    <Consummer>
      {(state, toggle) => (
        <button onClick={toggle}>{state ? "On" : "Off"}</button>
      )}
    </Consummer>
  );
};
