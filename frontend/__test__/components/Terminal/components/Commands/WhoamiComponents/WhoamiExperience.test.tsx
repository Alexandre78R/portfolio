import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import WhoamiExperience from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiExperience";
import { RootState } from "@/store/store";
import { ExperienceType } from "@/store/slices/experiencesSlice";
import Lang from "@/lang/typeLang";

const mockStore = configureStore([]);

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({
    translations: {
      buttonPaginationPrevious: "Précédent",
      buttonPaginationNext: "Suivant",
    } as Lang,
  }),
}));

describe("WhoamiExperience Component", () => {
  let store: ReturnType<typeof mockStore>;

  const mockExperiences: ExperienceType[] = [
    {
      id: 1,
      jobFR: "Développeur Frontend",
      jobEN: "Frontend Developer",
      job: "Développeur Frontend",
      business: "Entreprise A",
      employmentContractFR: null,
      employmentContractEN: null,
      employmentContract: null,
      startDateFR: "Jan 2022",
      startDateEN: "Jan 2022",
      startDate: "Jan 2022",
      endDateFR: "Dec 2022",
      endDateEN: "Dec 2022",
      endDate: "Dec 2022",
      month: 1,
      typeFR: "Expérience",
      typeEN: "Experience",
      type: "Expérience",
    },
    {
      id: 2,
      jobFR: "Développeur Backend",
      jobEN: "Backend Developer",
      job: "Développeur Backend",
      business: "Entreprise B",
      employmentContractFR: null,
      employmentContractEN: null,
      employmentContract: null,
      startDateFR: "Jan 2021",
      startDateEN: "Jan 2021",
      startDate: "Jan 2021",
      endDateFR: "Dec 2021",
      endDateEN: "Dec 2021",
      endDate: "Dec 2021",
      month: 1,
      typeFR: "Expérience",
      typeEN: "Experience",
      type: "Expérience",
    },
    {
      id: 3,
      jobFR: "Stage Fullstack",
      jobEN: "Fullstack Intern",
      job: "Stage Fullstack",
      business: "Entreprise C",
      employmentContractFR: null,
      employmentContractEN: null,
      employmentContract: null,
      startDateFR: "Juin 2020",
      startDateEN: "June 2020",
      startDate: "Juin 2020",
      endDateFR: "Dec 2020",
      endDateEN: "Dec 2020",
      endDate: "Dec 2020",
      month: 6,
      typeFR: "Stage",
      typeEN: "Internship",
      type: "Stage",
    },
    {
      id: 4,
      jobFR: "Intern Dev",
      jobEN: "Intern Developer",
      job: "Intern Dev",
      business: "Entreprise D",
      employmentContractFR: null,
      employmentContractEN: null,
      employmentContract: null,
      startDateFR: "Jan 2019",
      startDateEN: "Jan 2019",
      startDate: "Jan 2019",
      endDateFR: "Juin 2019",
      endDateEN: "June 2019",
      endDate: "Juin 2019",
      month: 1,
      typeFR: "Stage",
      typeEN: "Internship",
      type: "Stage",
    },
  ];

  it("should render without crashing when dataExperiences is empty", () => {
    store = mockStore({
      experiences: { dataExperiences: [] },
    } as Partial<RootState>);

    render(
      <Provider store={store}>
        <WhoamiExperience />
      </Provider>
    );

    expect(
      screen.queryByText("Développeur Frontend") as HTMLElement
    ).not.toBeInTheDocument();
  });

  it("should render experience items correctly and handle pagination (if visible)", async () => {
    store = mockStore({
      experiences: { dataExperiences: mockExperiences},
    } as Partial<RootState>);

    render(
      <Provider store={store}>
        <WhoamiExperience />
      </Provider>
    );

    expect(screen.getByText("Développeur Backend" as string)as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Stage Fullstack" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Intern Dev" as string) as HTMLElement).toBeInTheDocument();
    expect(
      screen.queryByText("Développeur Frontend" as string) as HTMLElement
    ).not.toBeInTheDocument();

    const nextButton: HTMLElement | null = screen.queryByRole("button", { name: "Suivant" });
    const previousButton: HTMLElement | null  = screen.queryByRole("button", { name: "Précédent" });

    if (nextButton) {
      expect(nextButton as HTMLElement).not.toBeDisabled();

      if (previousButton) {
        expect(previousButton as HTMLElement).toBeDisabled();
      }

      fireEvent.click(nextButton as HTMLElement);

      await waitFor(() => {
        expect(
          screen.getByText("Développeur Frontend" as string) as HTMLElement
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Développeur Backend" as string) as HTMLElement
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Stage Fullstack" as string) as HTMLElement
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Intern Dev" as string) as HTMLElement
      ).not.toBeInTheDocument();

      const previousButtonAfter: HTMLElement | null = screen.queryByRole("button", {
        name: "Précédent",
      });
      if (previousButtonAfter) {
        expect(previousButtonAfter as HTMLElement).not.toBeDisabled();
      }
    }
  });
});