'use client';

import { useEffect } from "react";
import { useLang } from "@/context/Lang/LangContext";
import { useSectionRefs } from "@/context/SectionRefs/SectionRefsContext";
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import TitleH2 from "@/components/Title/TitleH2";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSkills, updateSkillCategories } from "@/store/slices/skillsSlice";
import { updateProjectDescriptions, setProjects} from "@/store/slices/projectsSlice";
import { setEducations, updateEducationsTitle } from "@/store/slices/educationsSlice";
import { setExperiences, updateExperiences } from "@/store/slices/experiencesSlice";
import Seo from "@/components/Seo/Seo";
import Educations from "@/components/Careers/Careers";
import Contact from "@/components/Contact/Contact";
import {
  useGetProjectsListQuery,
  useGetSkillsListQuery,
  useGetEducationsListQuery,
  useGetExperiencesListQuery,
} from "@/types/graphql";


const Home: React.FC = (): React.ReactElement => {
  
  const projectsData = useGetProjectsListQuery();
  const skillsData = useGetSkillsListQuery();
  const educationsData = useGetEducationsListQuery();
  const experiencesData = useGetExperiencesListQuery();

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
  const dataEducations = useSelector(
    (state: RootState) => state.educations.dataEducations
  );
  const dataExperiences = useSelector(
    (state: RootState) => state.experiences.dataExperiences
  );

  useEffect(() => {
    const responseProject = projectsData.data?.projectList;

    if (responseProject?.code === 200 && responseProject.projects && dataProjects.length === 0) {
      const formattedProjects = responseProject.projects.map((project) => ({
        ...project,
        id: Number(project.id),
        github: project.github ?? null,
        description:
          translations.file === "fr" ? project.descriptionFR : project.descriptionEN,
      }));
      dispatch(setProjects(formattedProjects));
    }

    const responseSkill = skillsData.data?.skillList;

    if (responseSkill?.code === 200 && responseSkill.categories && dataSkills.length === 0) {
      const formattedSkills = responseSkill.categories.map((skill) => ({
        ...skill,
        id: Number(skill.id),
        category: translations.file === "fr" ? skill.categoryFR : skill.categoryEN,
      }));
      dispatch(setSkills(formattedSkills));
    }

    const responseEducation = educationsData.data?.educationList;

    if (responseEducation?.code === 200 && responseEducation.educations && dataEducations.length === 0) {
      const formattedEducation = responseEducation.educations.map((edu) => ({
        ...edu,
        id: parseInt(edu.id, 10),
        month: edu.month ?? null,
        title: translations.file === "fr" ? edu.titleFR : edu.titleEN,
        diplomaLevel:
          translations.file  === "fr" ? edu.diplomaLevelFR : edu.diplomaLevelEN,
        startDate:
          translations.file  === "fr" ? edu.startDateFR : edu.startDateEN,
        endDate: translations.file  === "fr" ? edu.endDateFR : edu.endDateEN,
        type: translations.file  === "fr" ? edu.typeFR : edu.typeEN,
      }));
      dispatch(setEducations(formattedEducation));
    }

    const responseExperience = experiencesData.data?.experienceList;

    if (responseExperience?.code === 200 && responseExperience.experiences && dataExperiences.length === 0) {
      const formattedExperience = responseExperience.experiences.map((exp) => ({
        ...exp,
        id: parseInt(exp.id, 10),
        month: exp.month ?? null, 
        employmentContractEN: exp.employmentContractEN ?? null,
        employmentContractFR: exp.employmentContractFR ?? null,
        job: translations.file === "fr" ? exp.jobFR : exp.jobEN,
        employmentContract:
          translations.file === "fr"
            ? exp.employmentContractFR
            : exp.employmentContractEN,
        startDate:
          translations.file === "fr" ? exp.startDateFR : exp.startDateEN,
        endDate: translations.file === "fr" ? exp.endDateFR : exp.endDateEN,
        type: translations.file === "fr" ? exp.typeFR : exp.typeEN,
      }));
      dispatch(setExperiences(formattedExperience));
    }
  }, [
      educationsData,
      experiencesData,
      projectsData,
      skillsData,
      dispatch,
      translations, 
      dataSkills,
      dataEducations,
      dataProjects,
      dataExperiences,
    ]);

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
            <TitleH2 title="Terminal" />
            <div className="flex flex-col items-center">
              <Terminal />
            </div>
          </section>
        ) : (
          <>
            <section ref={aboutMeRef} id="aboutme">
              <TitleH2 title={translations.nameCategoryAboutMe} />
              <AboutMe />
            </section>
            <section ref={skillRef} id="skill">
              <div>
                <TitleH2 title={translations.nameCategorySkills} />
              </div>
              <div>
                <HorizontalScroll data={dataSkills} category="skills" />
              </div>
            </section>
            <section ref={projectRef} id="project">
              <div>
                <TitleH2 title={translations.nameCategoryProjects} />
              </div>
              <HorizontalScroll data={dataProjects} category="projects" />
            </section>
            <section ref={educationRef} id="project">
              <div>
                <TitleH2 title={translations.nameCategoryCareer} />
              </div>
              <Educations />
            </section>
            <section ref={contactRef} id="contact">
              <div>
                <TitleH2 title={translations.nameCategoryContact} />
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
