import React, { ReactElement, useMemo } from "react";
import { Box } from "@mui/material";
import TextAdmin from "../Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export interface CharacterCountProps {
  readonly content: string;
}

const CharacterCount = ({ content }: CharacterCountProps): ReactElement => {
  const langContext = useLang();
  const translations = langContext?.translations || {};
  
  const visibleCharacterCount: number = useMemo((): number => {
    return content.replace(/<[^>]*>/gu, "").length;
  }, [content]);

  return (
    <Box className="text-right">
      <TextAdmin type="span">
        {visibleCharacterCount} {translations?.messageAdminEditorCharacterCount || "caractères visibles"}
      </TextAdmin>
    </Box>
  );
};

export default CharacterCount;
