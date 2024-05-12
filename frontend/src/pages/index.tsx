import { useState, useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";

const Home: React.FC = () => {

  const { translations } = useLang();
  const [dataSkills, setDataSkills] = useState<any[]>(skillsData);
  const [selectedView, setSelectedView] = useState<string>("text");
  const [checkSelectedView, setCheckSelectedView] = useState<boolean>(false);

  const skillDataLang = (lang: string) : any => {
    setDataSkills(skillsData.map(skill => ({ ...skill, category: lang === "fr" ? skill.categoryFR : skill.categoryEN })))
  };

  useEffect(() => {
    skillDataLang(translations.file)
  }, [translations])

  const handleViewSelect = (view : string) => {
    setSelectedView(view);
  };

  useEffect(() => {
    const checkChoiceViewLocalStorage: string | null = localStorage.getItem("voiceView");
    if (typeof checkChoiceViewLocalStorage === "string" && !checkSelectedView) {
      if (checkChoiceViewLocalStorage == "terminal" || checkChoiceViewLocalStorage == "text") {
        setSelectedView(checkChoiceViewLocalStorage);
        localStorage.setItem("voiceView", checkChoiceViewLocalStorage);
      } else {
        setSelectedView(checkChoiceViewLocalStorage);
        localStorage.setItem("voiceView", selectedView);
      }
      setCheckSelectedView(true);
    } else {
      localStorage.setItem("voiceView", selectedView);
    }
  }, [selectedView])
  
  
  return (
    <main className="bg-body mt-16">
      <section className="ml-5">
        <Title title={translations.nameCategoryChoiceView} />
        <ChoiceView 
          selectedView={selectedView} 
          setSelectedView={setSelectedView} 
          handleViewSelect={handleViewSelect}
        />
      </section>
      {
        selectedView === "terminal" ? 
        <>
          <section className="ml-5">
            <Title title="Terminal" />
          </section>
        </>
        :
        <>
          <section className="ml-5">
            <Title title={translations.nameCategorySkills} />
            <HorizontalScroll data={dataSkills} category="skills" />
          </section>
        </>
      }
    </main>
  );
}

export default Home;

