import { useState } from "react";
import { useLang } from "@/context/Lang/LangContext";
import Typography from '@material-ui/core/Typography';
import Title from "@/components/Title/Title";
import ButtonCustom from "../Button/Button";
import { Background } from "@tsparticles/engine";

type Props = {
    selectedView : string,
    setSelectedView: (view: string) => void,
    handleViewSelect: (view: string) => void,
}

const ChoiceView: React.FC<Props> = ({ selectedView, setSelectedView, handleViewSelect }) => {
  const { translations } = useLang();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: "25%", marginRight: '25%' }}>
        <ButtonCustom 
          onClick={() => handleViewSelect('terminal')}
          text={translations.buttonNameChoiceTerminale}
          style={{
              backgroundColor: selectedView !== "terminal" ? "black" : "",
          }}
        />
        <ButtonCustom
          onClick={() => handleViewSelect('text')}
          text={translations.buttonNameChoiceText}
          style={{
              backgroundColor: selectedView !== "text" ? "black" : "",
          }}
      />
    </div>
  );
};

export default ChoiceView;