import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mb-5 mt-10 text-3xl font-black tracking-tight first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 text-xl font-bold tracking-tight">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-5 leading-relaxed text-[color:var(--color-text-secondary)]">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-5 list-disc space-y-2 pl-6 text-[color:var(--color-text-secondary)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-5 list-decimal space-y-2 pl-6 text-[color:var(--color-text-secondary)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-[color:var(--color-text-primary)]">
            {children}
          </strong>
        ),
        a: ({ href, children }) => (
          <Link
            href={href ?? "#"}
            className="font-medium text-[color:var(--color-primary)] underline underline-offset-2 hover:no-underline"
          >
            {children}
          </Link>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-5 border-l-2 border-[color:var(--color-primary)] pl-4 italic text-[color:var(--color-text-secondary)]">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
