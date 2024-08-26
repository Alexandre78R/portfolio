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

      //test menu 1
      // <ul className="flex justify-between ml-[25%] mr-[25%] mt-3">
      //   <li className="mr-3">
      //     <a className="inline-block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white" href="#">Active Pill</a>
      //   </li>
      //   <li className="mr-3">
      //     <a className="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4" href="#">Pill</a>
      //   </li>
      // </ul>

      //test menu 2
      // <ul className="flex justify-between ml-[25%] mr-[25%] mt-5">
      //   <li className="-mb-px mr-1">
      //     <a className="bg-primary inline-block border-l border-t border-r border-primary rounded-t py-2 px-4 text-textButton font-semibold">{translations.buttonNameChoiceText}</a>
      //   </li>
      //   <li>
      //     <a className="bg-black inline-block border-l border-t border-r border-black rounded-t py-2 px-4 text-textButton font-semibold">{translations.buttonNameChoiceTerminale}</a>
      //   </li>
      // </ul>
  );
};

export default ChoiceView;