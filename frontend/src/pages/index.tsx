import { useState, useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import Projects from "@/components/Projects/Projects";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import { projectsData } from "@/Data/projectsData";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";
import Header from "@/components/Header/Header";
import { Typography } from "@mui/material";

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
    <main className="bg-body mt-[5%]">
      <section className="ml-3">
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
          <section className="ml-3 mt-[5%]">
            <Title title="Terminal" />
          </section>
        </>
        :
        <>
          <section className="ml-3 mt-[5%]">
            <Title title={translations.nameCategoryAboutMe} />
            <div className="flex flex-col items-center">
              <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
                <Typography variant="h5" component="h3" className="text-text">{translations.titleAboutMe}</Typography>
                <p className="text-text mt-4">
                  {translations.descriptionAboutMe1}
                </p>
                <p className="text-text mt-4">
                  {translations.descriptionAboutMe2}
                </p>
                <p className="text-text mt-4">
                  {translations.descriptionAboutMe3}
                </p>
              </div>
            </div>
          </section>
          <section className="ml-3 mt-[5%]">
            <Title title={translations.nameCategorySkills} />
            <div className="mt-[1%]">
              <HorizontalScroll data={dataSkills} category="skills" />
            </div>
          </section>
          <section className="ml-3 mt-[5%]">
            <Title title={translations.nameCategoryProjects} />
            <HorizontalScroll data={dataProjects} category="projects" />
          </section>
        </>
      }
    </main>
    </>
  );
}

export default Home;

