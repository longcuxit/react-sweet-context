import { Profiler } from "src/components/Profiler";
import { context, MultiState, SelectedName } from "./source";
import { CodePreview } from "src/components/CodePreview";
import source from "./source.tsx?raw";

const Example: React.FC = () => {
  return (
    <div>
      <p>This is a basic example showing the core functionality.</p>

      <Profiler title="Using hook by createHook" context={context}>
        <MultiState />
      </Profiler>

      <Profiler title="Using selected state by createHook" context={context}>
        <SelectedName />
      </Profiler>

      <CodePreview source={source} />
    </div>
  );
};

export default Example;
