import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

// Clicking a toolbar button normally steals focus/selection from the
// contentEditable editor before the click handler runs, so the
// heading/list/blockquote commands would apply to the wrong (or no)
// selection. Preventing default on mousedown keeps the editor's selection
// intact, which is why Bold/Italic "worked" (often used via keyboard
// shortcuts) while the toolbar-only commands didn't.
const preserveEditorSelection = (e: React.MouseEvent) => e.preventDefault();

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none min-h-[400px] font-serif focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // `content` is only used as the editor's initial doc at creation time —
  // TipTap doesn't resync it on prop changes. Without this, content that
  // arrives after mount (e.g. an existing article loading in async) never
  // reaches the editor. Guard against the editor's own onUpdate feeding
  // back here, which would otherwise reset the doc (and cursor) on every
  // keystroke.
  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b bg-secondary p-2">
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("bold")}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("italic")}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("bulletList")}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("orderedList")}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          type="button"
          size="sm"
          pressed={editor.isActive("blockquote")}
          onMouseDown={preserveEditorSelection}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="p-5 bg-secondary/40">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
