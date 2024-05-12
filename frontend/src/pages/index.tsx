import { useState, useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import Typography from '@material-ui/core/Typography';
import Title from "@/components/Title/Title";

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
    <main className="bg-body mt-16">
      <section className="ml-5">
        <Title title={translations.nameCategorySkills} />
        <HorizontalScroll data={dataSkills} category="skills" />
      </section>
    </main>
  );
}

export default Home;

