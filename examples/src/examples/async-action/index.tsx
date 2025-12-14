import React from "react";
import { TryLoading, context } from "./source";
import source from "./source.tsx?raw";
import { Profiler } from "src/components/Profiler";
import { CodePreview } from "src/components/CodePreview";

const Example: React.FC = () => {
  return (
    <div>
      <p>This is a basic example showing the core functionality.</p>
      <Profiler title="Using hook by createHook" context={context}>
        <TryLoading />
      </Profiler>

      <CodePreview source={source} />
    </div>
  );
};

export default Example;
