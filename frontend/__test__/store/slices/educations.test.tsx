import React, { FC } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setEducations, EducationType } from "@/store/slices/educationsSlice";

const TestEducationsSlice: FC = () => {
  const dispatch = useAppDispatch();
  const educations: EducationType[] = useAppSelector((state) => state.educations.dataEducations);

  const handleAddEducation = (): void => {
    const newEdu: EducationType = {
      id: 1,
      titleFR: "Bac",
      titleEN: "High School Diploma",
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
      diplomaLevelFR :  "Diplomate FR",
      diplomaLevelEN : "Diplomate En",
    };
    dispatch(setEducations([newEdu]));
  };

  return (
    <div>
      <span data-testid="education-count">{educations.length}</span>
      <button type="button" onClick={handleAddEducation}>add-education</button>
    </div>
  );
};

describe("Educations Slice", () => {
  it("should select and dispatch correctly", () => {
    render(
      <Provider store={store}>
        <TestEducationsSlice />
      </Provider>
    );

    const countSpan: HTMLElement = screen.getByTestId("education-count");
    expect(countSpan.textContent).toBe("0");

    const addButton: HTMLButtonElement = screen.getByText("add-education") as HTMLButtonElement;

    act(() => {
      fireEvent.click(addButton);
    });

    expect(countSpan.textContent).toBe("1");
  });
});