import { useState, useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import { skillsData } from "@/Data/skillsData";
import { projectsData } from "@/Data/projectsData";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import { useChoiceView } from "@/context/ChoiceView/ChoiceView";

const Home: React.FC = () => {

  const { translations } = useLang();
  const { aboutMeRef, projectRef, skillRef, choiceViewRef } = useSectionRefs();
  const { selectedView, setSelectedView } = useChoiceView();

  const [dataSkills, setDataSkills] = useState<any[]>(skillsData);
  const [dataProjects, setDataProjects] = useState<any[]>(projectsData);

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
  
  return (
    <>
    <Header />
    <main className="bg-body mt-[10%]">
      <section className="ml-3" ref={choiceViewRef}>
        <Title title={translations.nameCategoryChoiceView} />
        <ChoiceView 
          selectedView={selectedView} 
          setSelectedView={setSelectedView} 
          handleViewSelect={handleViewSelect}
        />
        {/* desable choice view */}
      </section>
      {
        selectedView === "terminal" ? 
        <>
          <section className="ml-3 mt-[5%] mb-[5%]">
            <Title title="Terminal" />
            <div className="ml-5 flex flex-col items-center">
              <Terminal />
            </div>
          </section>
        </>
        :
        <>
          <section className="ml-3 mt-[5%]" ref={aboutMeRef} id="aboutme">
            <Title title={translations.nameCategoryAboutMe} />
            <AboutMe />
          </section>
          <section className="ml-3 mt-[5%]" ref={skillRef} id="skill">
            <Title title={translations.nameCategorySkills} />
            <div className="mt-[1%]">
              <HorizontalScroll data={dataSkills} category="skills" />
            </div>
          </section>
          <section className="ml-3 mt-[5%]" ref={projectRef} id="project">
            <Title title={translations.nameCategoryProjects} />
            <HorizontalScroll data={dataProjects} category="projects" />
          </section>
        </>
      }
      </main>
      <Footer />
    </>
  );
}

export default Home;