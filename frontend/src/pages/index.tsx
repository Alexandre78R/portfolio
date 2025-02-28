'use client';

import { useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import Title from "@/components/Title/Title";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSkills, updateSkillCategories } from "@/store/slices/skillsSlice";
import { updateProjectDescriptions, setProjects} from "@/store/slices/projectsSlice";
import { updateEducationsTitle } from "@/store/slices/educationsSlice";
import { updateExperiences } from "@/store/slices/experiencesSlice";
import Seo from "@/components/Seo/Seo";
import Educations from "@/components/Careers/Careers";
import Contact from "@/components/Contact/Contact";
import {
  useGetProjectsListQuery,
  useGetSkillsListQuery
} from "@/types/graphql";

const Home: React.FC = (): React.ReactElement => {
  
  const projectsData = useGetProjectsListQuery();
  const skillsData = useGetSkillsListQuery();

  const { translations } = useLang();
  const {
    aboutMeRef,
    projectRef,
    skillRef,
    terminalRef,
    educationRef,
    contactRef,
  } = useSectionRefs();
  const { selectedView } = useChoiceView();

  const dispatch = useDispatch<AppDispatch>();
  const dataSkills = useSelector((state: RootState) => state.skills.dataSkills);
  const dataProjects = useSelector(
    (state: RootState) => state.projects.dataProjects
  );

  useEffect(() => {
    if (projectsData.data?.projectsList) {
      const formattedProjects = projectsData.data.projectsList.map((project) => ({
        ...project,
        id: Number(project.id),
        github: project.github ?? null,
        description:
          translations.file === "fr" ? project.descriptionFR : project.descriptionEN,
      }));
      dispatch(setProjects(formattedProjects));
    }
  }, [projectsData, dispatch, translations]);

    useEffect(() => {
    if (skillsData?.data?.skillList) {
      const formattedSkills = skillsData.data.skillList.map((skill) => ({
        ...skill,
        id: Number(skill.id),
        category: translations.file === "fr" ? skill.categoryFR : skill.categoryEN,
      }));
      dispatch(setSkills(formattedSkills));
    }
  }, [skillsData, dispatch, translations]);

  useEffect(() => {
    dispatch(updateSkillCategories(translations.file));
    dispatch(updateProjectDescriptions(translations.file));
    dispatch(updateEducationsTitle(translations.file));
    dispatch(updateExperiences(translations.file));
  }, [translations, dispatch]);

  return (
    <>
      <Seo />
      <Header />
      <main className="bg-body">
        {selectedView === "terminal" ? (
          <section ref={terminalRef}>
            <Title title="Terminal" />
            <div className="flex flex-col items-center">
              <Terminal />
            </div>
          </section>
        ) : (
          <>
            <section ref={aboutMeRef} id="aboutme">
              <Title title={translations.nameCategoryAboutMe} />
              <AboutMe />
            </section>
            <section ref={skillRef} id="skill">
              <div>
                <Title title={translations.nameCategorySkills} />
              </div>
              <div>
                <HorizontalScroll data={dataSkills} category="skills" />
              </div>
            </section>
            <section ref={projectRef} id="project">
              <div>
                <Title title={translations.nameCategoryProjects} />
              </div>
              <HorizontalScroll data={dataProjects} category="projects" />
            </section>
            <section ref={educationRef} id="project">
              <div>
                <Title title={translations.nameCategoryCareer} />
              </div>
              <Educations />
            </section>
            <section ref={contactRef} id="contact">
              <div>
                <Title title={translations.nameCategoryContact} />
              </div>
              <Contact />
            </section>
          </>
        )}
      </main>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default Home;
