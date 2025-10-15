import React, { FC } from "react";
import { render, screen } from "@testing-library/react";
import ReduxProvider from "@/store/provider";
import { useAppSelector } from "@/store/hook";
import { Skill } from "@/store/slices/skillsSlice";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";
import { Project } from "@/store/slices/projectsSlice";

const TestComponent: FC = () => {
  const skills: Skill[] = useAppSelector((state) => state.skills.dataSkills);
  const educations: EducationType[] = useAppSelector((state) => state.educations.dataEducations);
  const experiences: ExperienceType[] = useAppSelector((state) => state.experiences.dataExperiences);
  const projects: Project[] = useAppSelector((state) => state.projects.dataProjects);

  return (
    <div>
      <span data-testid="skills-length">{skills.length}</span>
      <span data-testid="educations-length">{educations.length}</span>
      <span data-testid="experiences-length">{experiences.length}</span>
      <span data-testid="projects-length">{projects.length}</span>
    </div>
  );
};

describe("ReduxProvider - all slices", () => {
  it("should provide redux store to all slices", () => {
    render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );

    const skillsLengthSpan: HTMLElement = screen.getByTestId("skills-length");
    const eduLengthSpan: HTMLElement = screen.getByTestId("educations-length");
    const expLengthSpan: HTMLElement = screen.getByTestId("experiences-length");
    const projLengthSpan: HTMLElement = screen.getByTestId("projects-length");

    expect(skillsLengthSpan.textContent).toBe("0");
    expect(eduLengthSpan.textContent).toBe("0");
    expect(expLengthSpan.textContent).toBe("0");
    expect(projLengthSpan.textContent).toBe("0");
  });
});