import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
}

/** Convert \[...\] and \(...\) delimiters to $$...$$ and $...$ so remark-math can parse them. */
function normalizeMathDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
}

/**
 * Renders text containing Markdown and LaTeX math.
 */
function MathRenderer({ content }: MathRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      skipHtml={true} 
    >
      {normalizeMathDelimiters(content)}
    </ReactMarkdown>
  );
}

export default MathRenderer;
