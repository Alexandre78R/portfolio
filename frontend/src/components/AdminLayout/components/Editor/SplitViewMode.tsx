import React, { ReactElement } from "react";
import { Box, Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextAdmin from "../Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

type QuillModule = Record<string, unknown>;
type QuillFormat = string[];

interface SplitViewModeProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly placeholder: string;
  readonly modules: QuillModule;
  readonly formats: QuillFormat;
}

const SplitViewMode = ({
  content,
  onChange,
  placeholder,
  modules,
  formats,
}: SplitViewModeProps): ReactElement => {
  const langContext = useLang();
  const translations = langContext?.translations || {};

  const handleQuillChange = (value: string): void => {
    onChange(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box className="space-y-2">
          <TextAdmin type="h5">{translations?.messageAdminEditorLeftLabel || "Éditeur"}</TextAdmin>
          <ReactQuill
            value={content}
            onChange={handleQuillChange}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder={placeholder}
            className="bg-gray-900 text-white rounded-md"
            style={{ minHeight: "350px" }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box className="space-y-2">
          <TextAdmin type="h5">{translations?.messageAdminEditorPreviewLabel || "Aperçu"}</TextAdmin>
          <Box
            className="w-full h-96 p-4 bg-white text-gray-900 rounded-md border border-gray-600 overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SplitViewMode;
