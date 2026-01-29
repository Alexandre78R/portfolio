import React, {
  ReactElement,
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import EditorTabs, { type TabOption, type EditorMode } from "./EditorTabs";
import WysiwygEditorMode from "./WysiwygEditorMode";
import SplitViewMode from "./SplitViewMode";
import CodeEditorMode from "./CodeEditorMode";
import CharacterCount from "./CharacterCount";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export type QuillModule = Record<string, unknown>;
export type QuillFormat = string[];

export interface HtmlEditorProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly placeholder?: string;
}

// Configure Quill Size format to use inline styles
const configureSizeFormat = (): void => {
  try {
    const QuillModule = require("react-quill").Quill;
    const SizeClass = QuillModule.import("formats/size");
    
    SizeClass.whitelist = ["small", "normal", "large", "huge"];
    QuillModule.register(SizeClass, true);
  } catch (error) {
    console.warn("Failed to configure Quill size format:", error);
  }
};

const QUILL_MODULES: QuillModule = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, false] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const QUILL_FORMATS: QuillFormat = [
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "size",
  "header",
  "blockquote",
  "code-block",
  "link",
  "image",
];

const SELF_CLOSING_TAGS: ReadonlyArray<string> = [
  "img",
  "br",
  "hr",
  "input",
  "meta",
  "link",
];

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  content,
  onChange,
  placeholder = "Entrez le contenu HTML de votre message...",
}: HtmlEditorProps): ReactElement => {
  const langContext: { translations: Lang } = useLang();
  const translations: Lang = langContext?.translations || {};
  const [mode, setMode]: [EditorMode, React.Dispatch<React.SetStateAction<EditorMode>>] = useState<EditorMode>("editor");
  const [showCode, setShowCode]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const debounceTimer: React.MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

  const EDITOR_TABS: ReadonlyArray<TabOption> = [
    {
      id: "editor",
      label: translations?.messageAdminEditorTabLabel || "Éditeur",
      icon: "✏️",
      type: "mode",
      ariaLabel: "Editor mode",
      value: "editor",
    },
    {
      id: "split",
      label: translations?.messageAdminEditorSplitLabel || "Aperçu",
      icon: "📋",
      type: "mode",
      ariaLabel: "Split view mode",
      value: "split",
    },
    {
      id: "code",
      label: translations?.messageAdminEditorCodeLabel || "Code",
      icon: "&lt;/&gt;",
      type: "toggle",
      ariaLabel: "Code mode",
    },
  ];

  useEffect(() => {
    configureSizeFormat();
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleHtmlKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const textarea: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement;
    const value: string = textarea.value;
    const cursorPos: number = textarea.selectionStart;

    if (e.key === ">") {
      const beforeCursor: string = value.substring(0, cursorPos);
      const tagMatch: RegExpMatchArray | null =
        beforeCursor.match(/<(\w+)(?:\s[^>]*)?$/);

      if (tagMatch && tagMatch[1]) {
        const tagName: string = tagMatch[1];

        if (!SELF_CLOSING_TAGS.includes(tagName.toLowerCase())) {
          e.preventDefault();
          const afterCursor: string = value.substring(cursorPos);
          const newValue: string =
            value.substring(0, cursorPos) + `></${tagName}>` + afterCursor;
          onChange(newValue);

          setTimeout(() => {
            textarea.selectionStart = cursorPos + 1;
            textarea.selectionEnd = cursorPos + 1;
          }, 0);
        }
      }
    }

    if (e.key === "Enter") {
      const beforeCursor: string = value.substring(0, cursorPos);
      const currentLine: string = beforeCursor.split("\n").pop() ?? "";
      const indent: string = currentLine.match(/^\s*$/)?.[0] ?? "";

      e.preventDefault();
      const afterCursor: string = value.substring(cursorPos);
      const newValue: string =
        value.substring(0, cursorPos) + "\n" + indent + afterCursor;
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = cursorPos + indent.length + 1;
        textarea.selectionEnd = cursorPos + indent.length + 1;
      }, 0);
    }
  };

  return (
    <div className="space-y-4">
      <EditorTabs
        mode={mode}
        showCode={showCode}
        tabs={EDITOR_TABS}
        onModeChange={(newMode: EditorMode): void => setMode(newMode)}
        onShowCodeChange={(newShowCode: boolean): void =>
          setShowCode(newShowCode)
        }
      />
      {mode === "editor" && !showCode && (
        <WysiwygEditorMode
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
        />
      )}

      {mode === "split" && !showCode && (
        <SplitViewMode
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
        />
      )}

      {showCode && (
        <CodeEditorMode
          content={content}
          onChange={onChange}
          onKeyDown={handleHtmlKeyDown}
        />
      )}

      <CharacterCount content={content} />
    </div>
  );
};

export default HtmlEditor;
