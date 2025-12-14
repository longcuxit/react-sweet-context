import {
  Profiler as ReactProfiler,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  useContext,
} from "react";

import { StoreContext } from "react-sweet-context";

// type CastContext<T>

type ProfilerProps = {
  title: string;
  children: ReactNode;
  context: StoreContext<any, any>;
};

export const Profiler = ({ title, children, context }: ProfilerProps) => {
  const [count, setCount] = useState(0);
  const onRender = useCallback(() => setCount((count) => count + 1), []);
  const element = useMemo(() => {
    return (
      <ReactProfiler id={title} onRender={onRender}>
        {children}
      </ReactProfiler>
    );
  }, [children, onRender]);

  const instance = useContext(context);

  return (
    <div className="example-content">
      <div className="title">{title}</div>
      {element}
      <hr />
      <div className="console">
        <small>Count render: {count}</small>
        <small style={{ marginLeft: 20 }}>
          Global State: {JSON.stringify(instance.value)}
        </small>
      </div>
    </div>
  );
};
