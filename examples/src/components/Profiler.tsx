import { ReactNode, useContext, useLayoutEffect } from "react";

import {
  createConsumer,
  createContainer,
  createSweetContext,
  StoreContext,
  injects,
  createAction,
} from "react-sweet-context";

const context = createSweetContext({
  initState: 0,
  action({ set }) {
    return set;
  },
});

const Container = createContainer(context);
const Consumer = createConsumer(context);
const useCouter = createAction(context);

injects.hook.listen(() => {
  const setCount = useCouter();

  useLayoutEffect(() => {
    setCount((c) => c + 1);
  });
});

type ProfilerProps = {
  title: string;
  children: ReactNode;
  context: StoreContext<any, any>;
};

export const Profiler = ({ title, children, context }: ProfilerProps) => {
  const instance = useContext(context);
  return (
    <Container>
      <div className="example-content">
        <div className="title">{title}</div>
        {children}
        <hr />
        <Consumer>
          {(count) => (
            <div className="console">
              <small>Count render: {count}</small>
              <small style={{ marginLeft: 20 }}>
                Global State: {JSON.stringify(instance.value)}
              </small>
            </div>
          )}
        </Consumer>
      </div>
    </Container>
  );
};
