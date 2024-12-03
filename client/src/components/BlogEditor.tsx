import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogEditorProps {
  content: string | JSONContent;
  onChange: (content: string | JSONContent) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: (() => {
      try {
        if (typeof content === "string") {
          return JSON.parse(content);
        }
        return content || { type: "doc", content: [{ type: "paragraph" }] };
      } catch (error) {
        console.error("Error parsing content:", error);
        return { type: "doc", content: [{ type: "paragraph" }] };
      }
    })(),
    onUpdate: ({ editor }) => {
      try {
        const json = editor.getJSON();
        onChange(json);
      } catch (error) {
        console.error("Error updating editor content:", error);
      }
    },
  });

  if (!editor) {
    return null;
  }

  const toggles = [
    {
      value: "bold",
      icon: <Bold className="h-4 w-4" />,
      isActive: () => editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      value: "italic",
      icon: <Italic className="h-4 w-4" />,
      isActive: () => editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      value: "heading",
      icon: <Heading2 className="h-4 w-4" />,
      isActive: () => editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      value: "bulletList",
      icon: <List className="h-4 w-4" />,
      isActive: () => editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      value: "orderedList",
      icon: <ListOrdered className="h-4 w-4" />,
      isActive: () => editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      value: "blockquote",
      icon: <Quote className="h-4 w-4" />,
      isActive: () => editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      value: "code",
      icon: <Code className="h-4 w-4" />,
      isActive: () => editor.isActive("code"),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  return (
    <div className="w-full border rounded-lg">
      <div className="flex items-center gap-2 p-2 border-b bg-muted/40">
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
          {toggles.map((toggle) => (
            <ToggleGroupItem
              key={toggle.value}
              value={toggle.value}
              aria-label={toggle.value}
              data-state={toggle.isActive() ? "on" : "off"}
              onClick={toggle.onClick}
              className={cn(
                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              )}
            >
              {toggle.icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none p-4 prose-p:text-foreground dark:prose-p:text-foreground prose-headings:text-foreground dark:prose-headings:text-foreground">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
