import React, { ReactElement } from "react";
import { render, RenderResult, screen } from '@test-utils';
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import WhoamiEducation from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiEducation";
import { RootState } from "@/store/store";
import { EducationType } from "@/store/slices/educationsSlice";
import { Store } from "redux";

type MockedStore = MockStoreEnhanced<Partial<RootState>, {}>;

const mockStore = configureStore<Partial<RootState>>();

describe("WhoamiEducation Component", () => {
  let store: MockedStore;

  const mockEducations: EducationType[] = [
    {
      id: 1,
      typeFR: "Éducation",
      typeEN: "Education",
      titleFR: "Master Informatique",
      titleEN: "Master Computer Science",
      title: "Master Informatique",
      diplomaLevelFR: "Master",
      diplomaLevelEN: "Master",
      diplomaLevel: "Master",
      school: "Université Paris",
      location: "Paris, France",
      year: 2024,
      startDateFR: "Septembre 2023",
      startDateEN: "September 2023",
      startDate: "Septembre 2023",
      endDateFR: "Juin 2024",
      endDateEN: "June 2024",
      endDate: "Juin 2024",
      month: 9,
    },
  ];

  const renderWithStore = (store: Store<Partial<RootState>>): RenderResult =>
    render(
      <Provider store={store}>
        <WhoamiEducation />
      </Provider>
    );

  it("renders without crashing when dataEducations is empty", (): void => {
    store = mockStore({
      educations: { dataEducations: [] },
    });

    renderWithStore(store);

    const missingElement: HTMLElement | null = screen.queryByText("Bachelor of Science");
    expect(missingElement).toBeNull();
  });

  it("renders education items correctly", (): void => {
    store = mockStore({
      educations: { dataEducations: mockEducations },
    });

    renderWithStore(store);

    mockEducations.forEach((edu: EducationType): void => {
      const yearElement: HTMLElement = screen.getByText(edu.year.toString());
      const schoolElement: HTMLElement = screen.getByText(edu.school);
      const locationElement: HTMLElement = screen.getByText(`- ${edu.location}`);

      expect(yearElement).toBeInTheDocument();
      expect(schoolElement).toBeInTheDocument();
      expect(locationElement).toBeInTheDocument();
    });
  });
});
