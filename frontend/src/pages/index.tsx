import { useState, useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import Projects from "@/components/Projects/Projects";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import { projectsData } from "@/Data/projectsData";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";
import Header from "@/components/Header/Header";

const Home: React.FC = () => {

  const { translations } = useLang();
  const [dataSkills, setDataSkills] = useState<any[]>(skillsData);
  const [dataProjects, setDataProjects] = useState<any[]>(projectsData);
  const [selectedView, setSelectedView] = useState<string>("text");
  const [checkSelectedView, setCheckSelectedView] = useState<boolean>(false);

  const skillDataLang = (lang: string) : any => {
    setDataSkills(skillsData.map(skill => ({ ...skill, category: lang === "fr" ? skill.categoryFR : skill.categoryEN })))
  };

  const projectDataLang = (lang: string) : any => {
    setDataProjects(projectsData.map(project => ({ ...project, description: lang === "fr" ? project.descriptionFR : project.descriptionEN })))
  };

  useEffect(() => {
    skillDataLang(translations.file)
    projectDataLang(translations.file)
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
    <>
    <Header />
    <main className="bg-body mt-10">
      <section className="ml-2">
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
          <section className="ml-2 mt-10">
            <Title title="Terminal" />
          </section>
        </>
        :
        <>
          <section className="ml-2 mt-10">
            <Title title={translations.nameCategorySkills} />
            <HorizontalScroll data={dataSkills} category="skills" />
          </section>
          {/* <section className="ml-2 mt-10"> */}
            {/* <Title title={translations.nameCategoryProjects} /> */}
            {/* <HorizontalScroll data={dataProjects} category="projects" /> */}
          {/* </section> */}
        </>
      }
    </main>
    </>
  );
}

export default Home;

