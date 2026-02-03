import { store, RootState } from "@/store/store";
import { Skill } from "@/store/slices/skillsSlice";
import { Project } from "@/store/slices/projectsSlice";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";
import { Social } from "@/store/slices/socialsSlice";
import { AboutMe } from "@/store/slices/aboutMeSlice";

describe("Redux Store", () => {
  it("should initialize with the correct slices", () => {
    const state: RootState = store.getState();

    expect(state).toHaveProperty("skills");
    expect(state).toHaveProperty("projects");
    expect(state).toHaveProperty("educations");
    expect(state).toHaveProperty("experiences");
    expect(state).toHaveProperty("socials");
    expect(state).toHaveProperty("aboutMe");
  });

  it("should have correct initial state", () => {
    const state: RootState = store.getState();

    const skills: Skill[] = state.skills.dataSkills;
    const projects: Project[] = state.projects.dataProjects;
    const educations: EducationType[] = state.educations.dataEducations;
    const experiences: ExperienceType[] = state.experiences.dataExperiences;
    const socials: Social[] = state.socials.dataSocials;
    const aboutMe: AboutMe | null = state.aboutMe.dataAboutMe;

    expect(skills).toEqual([]);
    expect(projects).toEqual([]);
    expect(educations).toEqual([]);
    expect(experiences).toEqual([]);
    expect(socials).toEqual([]);
    expect(aboutMe).toBeNull();
  });
});