import React, { ReactElement, useMemo } from "react";
import { Box } from "@mui/material";
import TextAdmin from "../Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

export interface CharacterCountProps {
  readonly content: string;
}

const CharacterCount: React.FC<CharacterCountProps> = ({ content }: CharacterCountProps): ReactElement => {
  const langContext: ReturnType<typeof useLang> = useLang();
  const translations: Lang = langContext?.translations || {};
  
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
