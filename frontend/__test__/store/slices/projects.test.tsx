import React, { FC } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setProjects, Project, SkillsProject } from "@/store/slices/projectsSlice";

const TestProjectsSlice: FC = () => {
  const dispatch = useAppDispatch();
  const projects: Project[] = useAppSelector((state) => state.projects.dataProjects);

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

  return (
    <div>
      <span data-testid="projects-count">{projects.length}</span>
      <button type="button" onClick={handleAddProject}>add-project</button>
    </div>
  );
};

describe("Projects Slice", () => {
  it("should select and dispatch correctly", () => {
    render(
      <Provider store={store}>
        <TestProjectsSlice />
      </Provider>
    );

    const countSpan: HTMLElement = screen.getByTestId("projects-count");
    expect(countSpan.textContent).toBe("0");

    const addButton: HTMLButtonElement = screen.getByText("add-project") as HTMLButtonElement;

    act(() => {
      fireEvent.click(addButton);
    });

    expect(countSpan.textContent).toBe("1");
  });
});