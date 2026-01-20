import React, { ReactElement } from "react";
import { Box } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextAdmin from "../Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export type QuillModule = Record<string, unknown>;
export type QuillFormat = string[];

export interface WysiwygEditorModeProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly placeholder: string;
  readonly modules: QuillModule;
  readonly formats: QuillFormat;
}

const WysiwygEditorMode = ({
  content,
  onChange,
  placeholder,
  modules,
  formats,
}: WysiwygEditorModeProps): ReactElement => {
  const langContext = useLang();
  const translations = langContext?.translations || {};

  const handleQuillChange = (value: string): void => {
    onChange(value);
  };

  return (
    <Box className="space-y-2">
      <ReactQuill
        value={content}
        onChange={handleQuillChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder={placeholder}
        className="bg-gray-900 text-white rounded-md"
        style={{ minHeight: "400px" }}
      />
      <TextAdmin type="span">
        {translations?.messageAdminEditorWysiwygHelp || "Conseils pour la mise en forme du texte"}
      </TextAdmin>
    </Box>
  );
};

export default WysiwygEditorMode;
