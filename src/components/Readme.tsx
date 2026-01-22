import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";

const mdPromise = fetch(
  "https://raw.githubusercontent.com/longcuxit/react-sweet-context/refs/heads/main/README.md"
).then((res) => res.text());

export default function GithubReadme() {
  const [md, setMd] = useState("");

  useEffect(() => {
    mdPromise.then(setMd);
  }, []);

  return (
    <ReactMarkdown
      components={{
        code({ className, children }) {
          if (!className) {
            return <code>{children}</code>;
          }
          if (!className) return children;
          const lang = className?.replace("language-", "") ?? "typescript";

          const html = Prism.highlight(
            String(children),
            Prism.languages[lang] ?? Prism.languages.typescript,
            lang
          );

          return (
            <pre className={`language-${lang}`}>
              <code
                className={`language-${lang}`}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </pre>
          );
        },
      }}
    >
      {md}
    </ReactMarkdown>
  );
}
