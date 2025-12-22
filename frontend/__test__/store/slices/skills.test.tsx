import { type FC } from "react";
import { render, screen, fireEvent, act } from '@test-utils';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setSkills, type Skill } from "@/store/slices/skillsSlice";

const TestSkillsSlice: FC = () => {
  const dispatch = useAppDispatch();
  const skills: Skill[] = useAppSelector((state) => state.skills.dataSkills);

  const handleAddSkill = (): void => {
    const newSkill: Skill = { id: 1, categoryFR: "Frontend", categoryEN: "Frontend", skills: [] };
    dispatch(setSkills([newSkill]));
  };

  return (
    <div>
      <span data-testid="skills-count">{skills.length}</span>
      <button type="button" onClick={handleAddSkill}>add-skill</button>
    </div>
  );
};

describe("Skills Slice", () => {
  it("should select and dispatch correctly", () => {
    render(
      <Provider store={store}>
        <TestSkillsSlice />
      </Provider>
    );

    const countSpan: HTMLElement = screen.getByTestId("skills-count");
    expect(countSpan.textContent).toBe("0");

    const addButton: HTMLButtonElement = screen.getByText("add-skill") as HTMLButtonElement;

    act(() => {
      fireEvent.click(addButton);
    });

    expect(countSpan.textContent).toBe("1");
  });
});
