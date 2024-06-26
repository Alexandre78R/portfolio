import { useLang } from "@/context/Lang/LangContext";
import ButtonCustom from "../Button/Button";

type Props = {
    selectedView : string,
    setSelectedView: (view: string) => void,
    handleViewSelect: (view: string) => void,
}

const ChoiceView: React.FC<Props> = ({ selectedView, setSelectedView, handleViewSelect }): React.ReactElement => {

  const { translations } = useLang();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: "25%", marginRight: '25%', marginTop: "3%" }}>
      <ButtonCustom
        onClick={() => handleViewSelect('text')}
        text={translations.buttonNameChoiceText}
        disable={selectedView == "text" ? true : false}
        disableHover={selectedView == "text" ? true : false}
      />
      <ButtonCustom 
        onClick={() => handleViewSelect('terminal')}
        text={translations.buttonNameChoiceTerminale}
        disable={selectedView == "terminal" ? true : false}
        disableHover={selectedView == "terminal" ? true : false}
      />
    </div>
  );
};

export default ChoiceView;