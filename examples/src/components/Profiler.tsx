import {
  ReactNode,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";

import {
  createContainer,
  createSweetContext,
  StoreContext,
  injects,
} from "react-sweet-context";

const counterContext = createSweetContext({
  initState: 0,
  action({ set }) {
    return set;
  },
});

const Container = createContainer(counterContext);

const injectFn = () => {
  const { action } = useContext(counterContext);

  useLayoutEffect(() => {
    action((c) => c + 1);
  });
};

injects.hook.listen(injectFn);
injects.action.listen(injectFn);
injects.consumer.listen(injectFn);

type ProfilerProps = {
  title: string;
  children: ReactNode;
  context: StoreContext<any, any>;
};

const ProfilerDetail = ({ context }: { context: StoreContext<any, any> }) => {
  const instance = useContext(context);
  const counter = useContext(counterContext);
  const count = useSyncExternalStore(
    counter.listen.bind(counter),
    () => counter.value
  );
  return (
    <div className="console">
      <small>Count render: {count}</small>
      <small style={{ marginLeft: 20 }}>
        Global State: {JSON.stringify(instance.value)}
      </small>
    </div>
  );
};

export const Profiler = ({ title, children, context }: ProfilerProps) => {
  return (
    <Container>
      <div className="example-content">
        <div className="title">{title}</div>
        {children}
        <hr />
        <ProfilerDetail context={context} />
      </div>
    </Container>
  );
};
