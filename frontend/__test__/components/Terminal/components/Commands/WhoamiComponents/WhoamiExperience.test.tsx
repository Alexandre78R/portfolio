import React from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import WhoamiExperience from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiExperience";
import { RootState } from "@/store/store";
import { ExperienceType } from "@/store/slices/experiencesSlice";
import Lang from "@/lang/typeLang";
import { Store } from "redux";

type MockedStore = MockStoreEnhanced<Partial<RootState>, {}>;
const mockStore = configureStore<Partial<RootState>>();

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      buttonPaginationPrevious: "Précédent",
      buttonPaginationNext: "Suivant",
    } as Lang,
  }),
}));

describe("WhoamiExperience Component", () => {
  let store: MockedStore;

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

  const renderWithStore = (store: Store<Partial<RootState>>): RenderResult =>
    render(
      <Provider store={store}>
        <WhoamiExperience />
      </Provider>
    );

  it("renders without crashing when dataExperiences is empty", (): void => {
    store = mockStore({
      experiences: { dataExperiences: [] },
    });

    renderWithStore(store);

    const missingElement: HTMLElement | null = screen.queryByText("Développeur Frontend");
    expect(missingElement).toBeNull();
  });

  it("renders experience items correctly and handles pagination", async (): Promise<void> => {
    store = mockStore({
      experiences: { dataExperiences: mockExperiences },
    });

    renderWithStore(store);

    const backendElement: HTMLElement = screen.getByText("Développeur Backend");
    const stageElement: HTMLElement = screen.getByText("Stage Fullstack");
    const internElement: HTMLElement = screen.getByText("Intern Dev");
    expect(backendElement).toBeInTheDocument();
    expect(stageElement).toBeInTheDocument();
    expect(internElement).toBeInTheDocument();

    const frontendElement: HTMLElement | null = screen.queryByText("Développeur Frontend");
    expect(frontendElement).toBeNull();

    const nextButton: HTMLElement | null = screen.queryByRole("button", { name: "Suivant" });
    const previousButton: HTMLElement | null = screen.queryByRole("button", { name: "Précédent" });

    if (nextButton) {
      expect(nextButton).not.toBeDisabled();
      if (previousButton) expect(previousButton).toBeDisabled();

      fireEvent.click(nextButton);

      await waitFor(() => {
        const frontendAfter: HTMLElement = screen.getByText("Développeur Frontend");
        expect(frontendAfter).toBeInTheDocument();
      });

      expect(screen.queryByText("Développeur Backend")).toBeNull();
      expect(screen.queryByText("Stage Fullstack")).toBeNull();
      expect(screen.queryByText("Intern Dev")).toBeNull();

      const previousButtonAfter: HTMLElement | null = screen.queryByRole("button", { name: "Précédent" });
      if (previousButtonAfter) expect(previousButtonAfter).not.toBeDisabled();
    }
  });
});