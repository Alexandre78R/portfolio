'use client';

import React, { useEffect, ReactElement } from "react";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import { useSectionRefs, SectionRefsContextProps } from "@/context/SectionRefs/SectionRefsContext";
import { useChoiceView, ChoiceVieContextType } from "@/context/ChoiceView/ChoiceViewContext";
import { useAppDispatch, useAppSelector } from "@/store/hook";

// Redux actions
import { setSkills, updateSkillCategories } from "@/store/slices/skillsSlice";
import { setProjects, updateProjectDescriptions } from "@/store/slices/projectsSlice";
import { setEducations, updateEducationsTitle } from "@/store/slices/educationsSlice";
import { setExperiences, updateExperiences } from "@/store/slices/experiencesSlice";
import { setSocials } from "@/store/slices/socialsSlice";
import { setAboutMe, updateAboutMeContent } from "@/store/slices/aboutMeSlice";

// Types Redux
import type { Skill } from "@/store/slices/skillsSlice";
import type { Project } from "@/store/slices/projectsSlice";
import type { EducationType } from "@/store/slices/educationsSlice";
import type { ExperienceType } from "@/store/slices/experiencesSlice";
import type { Social } from "@/store/slices/socialsSlice";
import type { AboutMe as AboutMeRedux } from "@/store/slices/aboutMeSlice";

// GraphQL hooks
import {
  useGetProjectsListQuery,
  useGetSkillsListQuery,
  useGetEducationsListQuery,
  useGetExperiencesListQuery,
  useGetAboutMeQuery,
  useGetSocialsListQuery,
  GetProjectsListQuery,
  GetSkillsListQuery,
  GetEducationsListQuery,
  GetExperiencesListQuery,
  GetAboutMeQuery,
  GetSocialsListQuery,
} from "@/types/graphql";

// Composants
import HorizontalScroll from "@/components/horizontalScroll/horizontalScroll";
import TitleH2 from "@/components/Title/TitleH2";
import Header from "@/components/Header/Header";
import AboutMe from "@/components/AboutMe/AboutMe";
import Footer from "@/components/Footer/Footer";
import Terminal from "@/components/Terminal/Terminal";
import Seo from "@/components/Seo/Seo";
import Educations from "@/components/Careers/Careers";
import Contact from "@/components/Contact/Contact";

const Home: React.FC = (): ReactElement => {
  const { data: projectsData } = useGetProjectsListQuery<GetProjectsListQuery>();
  const { data: skillsData } = useGetSkillsListQuery<GetSkillsListQuery>();
  const { data: educationsData } = useGetEducationsListQuery<GetEducationsListQuery>();
  const { data: experiencesData } = useGetExperiencesListQuery<GetExperiencesListQuery>();
  const { data: socialsData } = useGetSocialsListQuery<GetSocialsListQuery>();
  const { data: aboutMeData } = useGetAboutMeQuery<GetAboutMeQuery>();

  const { translations }: LangContextType = useLang();
  const { aboutMeRef, projectRef, skillRef, terminalRef, educationRef, contactRef }: SectionRefsContextProps = useSectionRefs();
  const { selectedView }: ChoiceVieContextType = useChoiceView();

  const dispatch: ReturnType<typeof useAppDispatch> = useAppDispatch();
  const dataSkills: Skill[] = useAppSelector((state: any) => state.skills.dataSkills);
  const dataProjects: Project[] = useAppSelector((state: any) => state.projects.dataProjects);
  const dataEducations: EducationType[] = useAppSelector((state: any) => state.educations.dataEducations);
  const dataExperiences: ExperienceType[] = useAppSelector((state: any) => state.experiences.dataExperiences);
  const dataSocials: Social[] = useAppSelector((state: any) => state.socials.dataSocials);
  const dataAboutMe: AboutMeRedux | null = useAppSelector((state: any) => state.aboutMe.dataAboutMe);

  useEffect(() => {
    const projectList = projectsData?.listProjects;
    if (!projectList || 
        !projectList.projects || 
        projectList.code !== 200 || 
        dataProjects.length > 0) {
      return;
    }

    const formattedProjects: Project[] = projectList.projects.map((project: any) => ({
      id: Number(project.id),
      title: project.title,
      descriptionFR: project.descriptionFR,
      descriptionEN: project.descriptionEN,
      typeDisplay: project.typeDisplay,
      github: project.github ?? null,
      contentDisplay: project.contentDisplay,
      image: project.image ?? null,
      video: project.video ?? null,
      skills: project.skills || [],
      description: translations.file === "fr" ? project.descriptionFR : project.descriptionEN,
    }));
    
    dispatch(setProjects(formattedProjects));
  }, [projectsData, dataProjects.length, dispatch, translations.file]);

  useEffect(() => {
    const skillList = skillsData?.listSkillCategories;
    if (!skillList || 
        !skillList.categories || 
        skillList.code !== 200 || 
        dataSkills.length > 0) {
      return;
    }

    const formattedSkills: Skill[] = skillList.categories.map((skill: any) => ({
      id: Number(skill.id),
      categoryFR: skill.categoryFR,
      categoryEN: skill.categoryEN,
      skills: skill.skills || [],
      category: translations.file === "fr" ? skill.categoryFR : skill.categoryEN,
    }));
    
    dispatch(setSkills(formattedSkills));
  }, [skillsData, dataSkills.length, dispatch, translations.file]);

  useEffect(() => {
    const educationList = educationsData?.listEducations;
    if (!educationList || 
        !educationList.educations || 
        educationList.code !== 200 || 
        dataEducations.length > 0) {
      return;
    }

    const formattedEducations: EducationType[] = educationList.educations.map((edu: any) => ({
      id: Number(edu.id),
      titleFR: edu.titleFR || "",
      titleEN: edu.titleEN || "",
      diplomaLevelFR: edu.diplomaLevelFR || "",
      diplomaLevelEN: edu.diplomaLevelEN || "",
      school: edu.school || "",
      location: edu.location || "",
      year: edu.year ? Number(edu.year) : 0,
      startDateFR: edu.startDateFR || "",
      startDateEN: edu.startDateEN || "",
      endDateFR: edu.endDateFR || "",
      endDateEN: edu.endDateEN || "",
      month: edu.month ? Number(edu.month) : null,
      typeFR: edu.typeFR || "",
      typeEN: edu.typeEN || "",
      title: translations.file === "fr" ? edu.titleFR : edu.titleEN,
      diplomaLevel: translations.file === "fr" ? edu.diplomaLevelFR : edu.diplomaLevelEN,
      startDate: translations.file === "fr" ? edu.startDateFR : edu.startDateEN,
      endDate: translations.file === "fr" ? edu.endDateFR : edu.endDateEN,
      type: translations.file === "fr" ? edu.typeFR : edu.typeEN,
    }));
    
    dispatch(setEducations(formattedEducations));
  }, [educationsData, dataEducations.length, dispatch, translations.file]);

  useEffect(() => {
    const experienceList = experiencesData?.listExperiences;
    if (!experienceList || 
        !experienceList.experiences || 
        experienceList.code !== 200 || 
        dataExperiences.length > 0) {
      return;
    }

    const formattedExperiences: ExperienceType[] = experienceList.experiences.map((exp: any) => ({
      id: Number(exp.id),
      jobFR: exp.jobFR || "",
      jobEN: exp.jobEN || "",
      business: exp.business || "",
      employmentContractFR: exp.employmentContractFR ?? null,
      employmentContractEN: exp.employmentContractEN ?? null,
      startDateFR: exp.startDateFR || "",
      startDateEN: exp.startDateEN || "",
      endDateFR: exp.endDateFR || "",
      endDateEN: exp.endDateEN || "",
      month: exp.month ? Number(exp.month) : null,
      typeFR: exp.typeFR || "",
      typeEN: exp.typeEN || "",
      job: translations.file === "fr" ? exp.jobFR : exp.jobEN,
      employmentContract: translations.file === "fr" ? exp.employmentContractFR : exp.employmentContractEN,
      startDate: translations.file === "fr" ? exp.startDateFR : exp.startDateEN,
      endDate: translations.file === "fr" ? exp.endDateFR : exp.endDateEN,
      type: translations.file === "fr" ? exp.typeFR : exp.typeEN,
    }));
    
    dispatch(setExperiences(formattedExperiences));
  }, [experiencesData, dataExperiences.length, dispatch, translations.file]);

  useEffect(() => {
    const socialList = socialsData?.listSocials;
    if (!Array.isArray(socialList) || dataSocials.length > 0) {
      return;
    }

    const formattedSocials: Social[] = socialList.map((social: any) => ({
      id: Number(social.id),
      title: social.title,
      url: social.url,
      tab: Number(social.tab),
    }));
    
    dispatch(setSocials(formattedSocials));
  }, [socialsData, dataSocials.length, dispatch]);

  useEffect(() => {
    const aboutMeResponse = aboutMeData?.getAboutMe;
    if (!aboutMeResponse || 
        !aboutMeResponse.aboutMe || 
        aboutMeResponse.code !== 200 || 
        dataAboutMe !== null) {
      return;
    }

    const aboutMe: AboutMeRedux = {
      id: Number(aboutMeResponse.aboutMe.id),
      titleEN: aboutMeResponse.aboutMe.titleEN,
      titleFR: aboutMeResponse.aboutMe.titleFR,
      descriptionEN: aboutMeResponse.aboutMe.descriptionEN,
      descriptionFR: aboutMeResponse.aboutMe.descriptionFR,
    };
    
    dispatch(setAboutMe(aboutMe));
  }, [aboutMeData, dataAboutMe, dispatch]);

  useEffect(() => {
    dispatch(updateSkillCategories(translations.file));
    dispatch(updateProjectDescriptions(translations.file));
    dispatch(updateEducationsTitle(translations.file));
    dispatch(updateExperiences(translations.file));
    dispatch(updateAboutMeContent(translations.file));
  }, [translations.file, dispatch]);

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
              <TitleH2 title={translations.nameCategorySkills} />
              <HorizontalScroll data={dataSkills} category="skills" testId="horizontal-scroll-skills" />
            </section>
            <section ref={projectRef} id="project">
              <TitleH2 title={translations.nameCategoryProjects} />
              <HorizontalScroll data={dataProjects} category="projects" testId="horizontal-scroll-projects" />
            </section>
            <section ref={educationRef} id="career">
              <TitleH2 title={translations.nameCategoryCareer} />
              <Educations />
            </section>
            <section ref={contactRef} id="contact">
              <TitleH2 title={translations.nameCategoryContact} />
              <Contact />
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;