import { useParams } from "react-router-dom";
import { routers } from "../Router";

const ExampleContent = () => {
  const { exampleId } = useParams();
  const example = routers[exampleId || ""];

  return (
    <div className="example-content-container">
      {example && <example.component />}
    </div>
  );
};

export default ExampleContent;
