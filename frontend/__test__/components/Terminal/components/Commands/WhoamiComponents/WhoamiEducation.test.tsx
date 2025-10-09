import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import WhoamiEducation from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiEducation";
import { RootState } from "@/store/store";
import { EducationType } from "@/store/slices/educationsSlice";

const mockStore = configureStore([]);

describe("WhoamiEducation Component", () => {
  let store: ReturnType<typeof mockStore>;
  
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

  it("should render without crashing when dataEducations is empty", () => {
    store = mockStore({
      educations: { dataEducations: [] },
    } as Partial<RootState>);

    render(
      <Provider store={store}>
        <WhoamiEducation />
      </Provider>
    );

    expect(screen.queryByText("Bachelor of Science")).not.toBeInTheDocument();
  });

  it("should render education items correctly", () => {
    store = mockStore({
      educations: { dataEducations: mockEducations },
    } as Partial<RootState>);

    render(
      <Provider store={store}>
        <WhoamiEducation />
      </Provider>
    );

    mockEducations.forEach((edu) => {
      expect(screen.getByText(edu.year as number) as HTMLElement).toBeInTheDocument();
      expect(screen.getByText(edu.school as string) as HTMLElement).toBeInTheDocument();
      expect(screen.getByText(`- ${edu.location}` as string) as HTMLElement).toBeInTheDocument();
    });
  });
});