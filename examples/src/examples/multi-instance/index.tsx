import React from "react";
import { Counter, NestedCounters, context } from "./source";
import source from "./source.tsx?raw";
import { Profiler } from "src/components/Profiler";
import { CodePreview } from "src/components/CodePreview";

const Example: React.FC = () => {
  return (
    <div>
      <p>This is a basic example showing the core functionality.</p>

      <Profiler title="Using new instance with Container" context={context}>
        <Counter />
      </Profiler>

      <Profiler title="Using new instance with Container" context={context}>
        <Counter />
      </Profiler>

      <Profiler title="Using nested Containers" context={context}>
        <NestedCounters />
      </Profiler>

      <CodePreview source={source} />
    </div>
  );
};

export default Example;
