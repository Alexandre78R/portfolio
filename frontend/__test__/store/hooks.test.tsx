import React, { FC } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSkills, Skill } from "@/store/slices/skillsSlice";
import { setEducations, EducationType } from "@/store/slices/educationsSlice";
import { setExperiences, ExperienceType } from "@/store/slices/experiencesSlice";
import { setProjects, Project, SkillsProject } from "@/store/slices/projectsSlice";
import { setSocials, Social } from "@/store/slices/socialsSlice";

const TestHooksComponent: FC = () => {
  const dispatch = useAppDispatch();

  const skills: Skill[] = useAppSelector((state) => state.skills.dataSkills);
  const educations: EducationType[] = useAppSelector((state) => state.educations.dataEducations);
  const experiences: ExperienceType[] = useAppSelector((state) => state.experiences.dataExperiences);
  const projects: Project[] = useAppSelector((state) => state.projects.dataProjects);
  const socials: Social[] = useAppSelector((state) => state.socials.dataSocials);

  const handleAddSkill = (): void => {
    const newSkill: Skill = {
      id: 1,
      categoryFR: "Frontend",
      categoryEN: "Frontend",
      skills: [],
    };
    dispatch(setSkills([newSkill]));
  };

  const handleAddEducation = (): void => {
    const newEdu: EducationType = {
      id: 1,
      titleFR: "Bac",
      titleEN: "High School Diploma",
      diplomaLevelFR: "Bac",
      diplomaLevelEN: "High School",
      school: "Lycée Exemple",
      location: "Paris",
      year: 2020,
      startDateFR: "09/2017",
      startDateEN: "09/2017",
      endDateFR: "06/2020",
      endDateEN: "06/2020",
      month: null,
      typeFR: "Diplôme",
      typeEN: "Diploma",
    };
    dispatch(setEducations([newEdu]));
  };

  const handleAddExperience = (): void => {
    const newExp: ExperienceType = {
      id: 1,
      jobFR: "Développeur Frontend",
      jobEN: "Frontend Developer",
      business: "Entreprise Exemple",
      startDateFR: "01/2021",
      startDateEN: "01/2021",
      endDateFR: "12/2022",
      endDateEN: "12/2022",
      month: null,
      typeFR: "CDI",
      typeEN: "Full-time",
    };
    dispatch(setExperiences([newExp]));
  };

  const handleAddProject = (): void => {
    const newProj: Project = {
      id: 1,
      title: "Mon projet",
      descriptionFR: "Description FR",
      descriptionEN: "Description EN",
      typeDisplay: "Web",
      github: null,
      contentDisplay: "Content",
      skills: [] as SkillsProject[],
    };
    dispatch(setProjects([newProj]));
  };

  const handleAddSocial = (): void => {
    const newSocial: Social = {
      id: 1,
      title: "GitHub",
      url: "https://github.com",
      tab: 3,
    };
    dispatch(setSocials([newSocial]));
  };

  return (
    <div>
      <div>
        <span data-testid="skills-count">{skills.length}</span>
        <button type="button" onClick={handleAddSkill}>add-skill</button>
      </div>
      <div>
        <span data-testid="education-count">{educations.length}</span>
        <button type="button" onClick={handleAddEducation}>add-education</button>
      </div>
      <div>
        <span data-testid="experience-count">{experiences.length}</span>
        <button type="button" onClick={handleAddExperience}>add-experience</button>
      </div>
      <div>
        <span data-testid="projects-count">{projects.length}</span>
        <button type="button" onClick={handleAddProject}>add-project</button>
      </div>
      <div>
        <span data-testid="socials-count">{socials.length}</span>
        <button type="button" onClick={handleAddSocial}>add-social</button>
      </div>
    </div>
  );
};

describe("Redux Hooks - all slices", () => {
  it("should select and dispatch correctly for skills, educations, experiences, projects and socials", () => {
    render(
      <Provider store={store}>
        <TestHooksComponent />
      </Provider>
    );

    const skillsCount: HTMLElement = screen.getByTestId("skills-count");
    const eduCount: HTMLElement = screen.getByTestId("education-count");
    const expCount: HTMLElement = screen.getByTestId("experience-count");
    const projCount: HTMLElement = screen.getByTestId("projects-count");
    const socialsCount: HTMLElement = screen.getByTestId("socials-count");

    expect(skillsCount.textContent).toBe("0");
    expect(eduCount.textContent).toBe("0");
    expect(expCount.textContent).toBe("0");
    expect(projCount.textContent).toBe("0");
    expect(socialsCount.textContent).toBe("0");

    const skillsButton: HTMLButtonElement = screen.getByText("add-skill") as HTMLButtonElement;
    const eduButton: HTMLButtonElement = screen.getByText("add-education") as HTMLButtonElement;
    const expButton: HTMLButtonElement = screen.getByText("add-experience") as HTMLButtonElement;
    const projButton: HTMLButtonElement = screen.getByText("add-project") as HTMLButtonElement;
    const socialsButton: HTMLButtonElement = screen.getByText("add-social") as HTMLButtonElement;

    act(() => {
      fireEvent.click(skillsButton);
      fireEvent.click(eduButton);
      fireEvent.click(expButton);
      fireEvent.click(projButton);
      fireEvent.click(socialsButton);
    });

    expect(skillsCount.textContent).toBe("1");
    expect(eduCount.textContent).toBe("1");
    expect(expCount.textContent).toBe("1");
    expect(projCount.textContent).toBe("1");
    expect(socialsCount.textContent).toBe("1");
  });
});