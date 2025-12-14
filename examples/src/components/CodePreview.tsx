import Prism from "prismjs";
import { useMemo } from "react";

function countlines(str: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 10) count++;
  }
  return count;
}

export const CodePreview = ({ source }: { source: string }) => {
  const { __html, lines } = useMemo(() => {
    return {
      __html: Prism.highlight(source, Prism.languages.tsx, "tsx"),
      lines: countlines(source),
    };
  }, [source]);

  return (
    <pre className="code-preview">
      <div className="line-numbers">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} data-line={i + 1} />
        ))}
      </div>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  );
};
