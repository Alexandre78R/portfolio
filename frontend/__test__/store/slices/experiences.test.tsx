import { type FC } from "react";
import { render, screen, fireEvent, act } from '@test-utils';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setExperiences, type ExperienceType } from "@/store/slices/experiencesSlice";

const TestExperiencesSlice: FC = () => {
  const dispatch = useAppDispatch();
  const experiences: ExperienceType[] = useAppSelector((state) => state.experiences.dataExperiences);

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

  return (
    <div>
      <span data-testid="experience-count">{experiences.length}</span>
      <button type="button" onClick={handleAddExperience}>add-experience</button>
    </div>
  );
};

describe("Experiences Slice", () => {
  it("should select and dispatch correctly", () => {
    render(
      <Provider store={store}>
        <TestExperiencesSlice />
      </Provider>
    );

    const countSpan: HTMLElement = screen.getByTestId("experience-count");
    expect(countSpan.textContent).toBe("0");

    const addButton: HTMLButtonElement = screen.getByText("add-experience") as HTMLButtonElement;

    act(() => {
      fireEvent.click(addButton);
    });

    expect(countSpan.textContent).toBe("1");
  });
});
