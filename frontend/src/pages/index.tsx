import { useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import Title from "@/components/Title/Title";
import ChoiceView from "@/components/ChoiceView/ChoiceView";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateSkillCategories } from "@/store/slices/skillsSlice";
import { updateProjectDescriptions } from "@/store/slices/projectsSlice";
import { updateEducationsTitle } from "@/store/slices/educationsSlice";
import { updateExperiences } from "@/store/slices/experiencesSlice";

const Home: React.FC = (): React.ReactElement  => {

  const { translations } = useLang();
  const { aboutMeRef, projectRef, skillRef, choiceViewRef } = useSectionRefs();
  const { selectedView, setSelectedView } = useChoiceView();

  const dispatch = useDispatch<AppDispatch>();
  const dataSkills = useSelector((state: RootState) => state.skills.dataSkills);
  const dataProjects = useSelector((state: RootState) => state.projects.dataProjects);

  useEffect(() => {
    dispatch(updateSkillCategories(translations.file));
    dispatch(updateProjectDescriptions(translations.file));
    dispatch(updateEducationsTitle(translations.file));
    dispatch(updateExperiences(translations.file));
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