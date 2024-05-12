import { useState } from "react";
import { useLang } from "@/context/Lang/LangContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import { useEffect } from "react";

const Home: React.FC = () => {
  const { translations } = useLang();
  const [ dataSkills, setDataSkills ] = useState(skillsData);

  const skillDataLang = (lang: string) : any => {
    setDataSkills(skillsData.map(skill => ({ ...skill, category: lang === "fr" ? skill.categoryFR : skill.categoryEN })))
  };

  useEffect(() => {
    skillDataLang(translations.file)
  }, [translations])
  
  
  return (
    <main className="bg-body">
      <>
        <HorizontalScroll data={dataSkills} category="skills" />
      </>
    </main>
  );
}

export default Home;

