import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from '@/components/ui/card';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <Card className={`p-6 prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground border-b pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          
          // Custom paragraph styling
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-muted-foreground">
              {children}
            </p>
          ),
          
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic bg-muted/30 py-2">
              {children}
            </blockquote>
          ),
          
          // Custom list styling
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground">
              {children}
            </ol>
          ),
          
          // Custom code block with syntax highlighting
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !props.node?.position?.start?.line || 
                           !props.node?.position?.end?.line || 
                           props.node.position.start.line === props.node.position.end.line;
            
            return !isInline && match ? (
              <SyntaxHighlighter
                style={oneDark as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Custom image styling
          img: ({ src, alt }) => (
            <div className="my-6">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg border shadow-sm"
                loading="lazy"
              />
              {alt && (
                <p className="text-sm text-muted-foreground text-center mt-2 italic">
                  {alt}
                </p>
              )}
            </div>
          ),
          
          // Custom table styling
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-muted">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-muted bg-muted/50 px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-muted px-4 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          
          // Custom horizontal rule
          hr: () => (
            <hr className="my-8 border-muted" />
          ),
          
          // Custom strong/bold styling
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          
          // Custom emphasis/italic styling
          em: ({ children }) => (
            <em className="italic text-muted-foreground">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Card>
  );
}