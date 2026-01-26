import { type Post } from "@db/schema";

interface RichTextRendererProps {
  content: Post["content"];
  truncate?: boolean;
}

export default function RichTextRenderer({ content, truncate = false }: RichTextRendererProps) {
  if (!content || typeof content !== "object") return null;

  const doc = content as { type: string; content: any[] };
  
  // Simple function to render text content from the first paragraph
  const getPlainText = () => {
    if (doc.type !== "doc" || !Array.isArray(doc.content)) return "";
    
    const firstParagraph = doc.content.find(node => node.type === "paragraph");
    if (!firstParagraph || !Array.isArray(firstParagraph.content)) return "";
    
    return firstParagraph.content
      .map((item: { text?: string }) => item.text || "")
      .join("")
      .slice(0, truncate ? 200 : undefined);
  };

  return (
    <div className="prose dark:prose-invert">
      <p>
        {getPlainText()}
        {truncate && "..."}
      </p>
    </div>
  );
}
