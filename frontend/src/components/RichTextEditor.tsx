import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="border rounded">
      <div className="flex gap-2 p-2 border-b text-sm">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-3" />
    </div>
  )
}
