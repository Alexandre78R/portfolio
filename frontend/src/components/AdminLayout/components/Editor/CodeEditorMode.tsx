import React, { ReactElement, KeyboardEvent, ChangeEvent } from "react";
import { Box } from "@mui/material";
import TextAdmin from "../Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export interface CodeEditorModeProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const SELF_CLOSING_TAGS: ReadonlyArray<string> = [
  "img",
  "br",
  "hr",
  "input",
  "meta",
  "link",
];

const CodeEditorMode = ({
  content,
  onChange,
  onKeyDown,
}: CodeEditorModeProps): ReactElement => {
  const langContext = useLang();
  const translations = langContext?.translations || {};

  const handleHtmlChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value }: { readonly value: string } = e.currentTarget;
    onChange(value);
  };

  return (
    <Box className="space-y-2">
      <TextAdmin type="h5">{translations?.messageAdminEditorCodeTitle || "Éditeur HTML"}</TextAdmin>
      <textarea
        value={content}
        onChange={handleHtmlChange}
        onKeyDown={onKeyDown}
        placeholder="Entrez votre HTML personnalisé ici..."
        className="w-full h-96 p-3 bg-gray-800 text-white rounded-md border border-gray-600 font-mono text-sm focus:outline-none focus:border-blue-500"
        spellCheck={false}
        aria-label="HTML code editor"
      />
      <TextAdmin type="span">
        {translations?.messageAdminEditorCodeHelp || "Conseil: Accédez aux balises avec Ctrl+/"}
      </TextAdmin>
    </Box>
  );
};

export default CodeEditorMode;
