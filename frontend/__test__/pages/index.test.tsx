import React, { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/pages";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import { useSectionRefs, SectionRefsContextProps } from "@/context/SectionRefs/SectionRefsContext";
import { useChoiceView, ChoiceVieContextType } from "@/context/ChoiceView/ChoiceViewContext";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import * as skillsSlice from "@/store/slices/skillsSlice";
import * as projectsSlice from "@/store/slices/projectsSlice";
import * as educationsSlice from "@/store/slices/educationsSlice";
import * as experiencesSlice from "@/store/slices/experiencesSlice";
import * as socialsSlice from "@/store/slices/socialsSlice";
import {
  useGetProjectsListQuery,
  useGetSkillsListQuery,
  useGetEducationsListQuery,
  useGetExperiencesListQuery,
  Project,
  Skill,
  Education,
  Experience,
} from "@/types/graphql";
import Lang from "@/lang/typeLang";
import { Social } from "@/store/slices/socialsSlice";
import { useQuery } from "@apollo/client";

jest.mock("@/context/Lang/LangContext");
jest.mock("@/context/SectionRefs/SectionRefsContext");
jest.mock("@/context/ChoiceView/ChoiceViewContext");
jest.mock("@/store/hook");
jest.mock("@/types/graphql");
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(),
}));

jest.mock("@/components/Seo/Seo", () => {
  const MockSeo = (): ReactElement => <div>SeoComponent</div>;
  MockSeo.displayName = "Seo";
  return MockSeo;
});

jest.mock("@/components/Header/Header", () => {
  const MockHeader = (): ReactElement => <div>HeaderComponent</div>;
  MockHeader.displayName = "Header";
  return MockHeader;
});

jest.mock("@/components/AboutMe/AboutMe", () => {
  const MockAboutMe = (): ReactElement => <div>AboutMeComponent</div>;
  MockAboutMe.displayName = "AboutMe";
  return MockAboutMe;
});

jest.mock("@/components/horizontalScroll/horizontalScroll", () => {
  type Props = { data: unknown[]; category: string; testId?: string };
  const MockHorizontalScroll = ({ data, category, testId }: Props): ReactElement => (
    <div data-testid={testId ?? `horizontal-scroll-${category}`}>
      HorizontalScroll {category} {data.length}
    </div>
  );
  MockHorizontalScroll.displayName = "HorizontalScroll";
  return MockHorizontalScroll;
});

jest.mock("@/components/Title/TitleH2", () => {
  const MockTitleH2 = ({ title }: { title: string }): ReactElement => <h2>{title}</h2>;
  MockTitleH2.displayName = "TitleH2";
  return MockTitleH2;
});

jest.mock("@/components/Footer/Footer", () => {
  const MockFooter = (): ReactElement => <div>FooterComponent</div>;
  MockFooter.displayName = "Footer";
  return MockFooter;
});

jest.mock("@/components/Terminal/Terminal", () => {
  const MockTerminal = (): ReactElement => <div>TerminalComponent</div>;
  MockTerminal.displayName = "Terminal";
  return MockTerminal;
});

jest.mock("@/components/Careers/Careers", () => {
  const MockEducations = (): ReactElement => <div>EducationsComponent</div>;
  MockEducations.displayName = "Educations";
  return MockEducations;
});

jest.mock("@/components/Contact/Contact", () => {
  const MockContact = (): ReactElement => <div>ContactComponent</div>;
  MockContact.displayName = "Contact";
  return MockContact;
});

describe("Home Component", (): void => {
  let dispatchMock: jest.Mock;

  beforeEach((): void => {
    jest.clearAllMocks();
    dispatchMock = jest.fn();

    const mockTranslations = {
      file: "fr",
      nameCategoryAboutMe: "À propos",
      nameCategorySkills: "Compétences",
      nameCategoryProjects: "Projets",
      nameCategoryCareer: "Carrière",
      nameCategoryContact: "Contact",
      titleHTML: "Titre page",
      titleHTMLNotFound: "Page non trouvée",
      titleHTMLUnauthorizedAccess: "Accès refusé",
      descHTML: "Description de la page",
    } as Lang;

    (useLang as jest.Mock<LangContextType>).mockReturnValue({
      lang: "fr",
      setLang: jest.fn(),
      translations: mockTranslations,
      listLang: ["fr", "en"],
    });

    (useSectionRefs as jest.Mock<SectionRefsContextProps>).mockReturnValue({
      aboutMeRef: { current: null },
      projectRef: { current: null },
      headerRef: { current: null },
      skillRef: { current: null },
      terminalRef: { current: null },
      educationRef: { current: null },
      contactRef: { current: null },
    });

    (useChoiceView as jest.Mock<ChoiceVieContextType>).mockReturnValue({
      selectedView: "default",
      setSelectedView: jest.fn(),
    });

    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    (useAppSelector as jest.Mock).mockImplementation((selectorFn: (state: any) => unknown) =>
      selectorFn({
        skills: { dataSkills: [] },
        projects: { dataProjects: [] },
        educations: { dataEducations: [] },
        experiences: { dataExperiences: [] },
        socials: { dataSocials: [] },
      })
    );

    (useGetProjectsListQuery as jest.Mock).mockReturnValue({ data: { projectList: { code: 200, projects: [] as Project[] } } });
    (useGetSkillsListQuery as jest.Mock).mockReturnValue({ data: { skillList: { code: 200, categories: [] as Skill[] } } });
    (useGetEducationsListQuery as jest.Mock).mockReturnValue({ data: { educationList: { code: 200, educations: [] as Education[] } } });
    (useGetExperiencesListQuery as jest.Mock).mockReturnValue({ data: { experienceList: { code: 200, experiences: [] as Experience[] } } });
    
    (useQuery as jest.Mock).mockReturnValue({ data: { socialList: [] as Social[] } });
  });

  it("renders all main components", async (): Promise<void> => {
    render(<Home />);
    expect(screen.getByText("SeoComponent")).toBeInTheDocument();
    expect(screen.getByText("HeaderComponent")).toBeInTheDocument();
    expect(screen.getByText("À propos")).toBeInTheDocument();
    expect(screen.getByText("Compétences")).toBeInTheDocument();
    expect(screen.getByText("Projets")).toBeInTheDocument();
    expect(screen.getByText("Carrière")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("AboutMeComponent")).toBeInTheDocument();
    expect(screen.getByTestId("horizontal-scroll-skills")).toBeInTheDocument();
    expect(screen.getByTestId("horizontal-scroll-projects")).toBeInTheDocument();
    expect(screen.getByText("EducationsComponent")).toBeInTheDocument();
    expect(screen.getByText("ContactComponent")).toBeInTheDocument();
    expect(screen.getByText("FooterComponent")).toBeInTheDocument();
  });

  it("dispatches skill, project, education, experience and socials updates", async (): Promise<void> => {
    render(<Home />);
    await waitFor((): void => {
      expect(dispatchMock).toHaveBeenCalledTimes(9);
    });
  });

  it("renders terminal view when selectedView is terminal", (): void => {
    (useChoiceView as jest.Mock<ChoiceVieContextType>).mockReturnValue({
      selectedView: "terminal",
      setSelectedView: jest.fn(),
    });
    render(<Home />);
    expect(screen.getByText("TerminalComponent")).toBeInTheDocument();
    expect(screen.queryByText("À propos")).toBeNull();
  });

  it("formats and dispatches project data correctly", async (): Promise<void> => {
    const mockProjects: Project[] = [
        {
        id: "1",
        descriptionFR: "Desc FR",
        descriptionEN: "Desc EN",
        github: null,
        contentDisplay: "Contenu affiché",
        skills: [],
        title: "Projet 1",
        typeDisplay: "Web",
        },
    ];

    (useGetProjectsListQuery as jest.Mock).mockReturnValue({
        data: { projectList: { code: 200, projects: mockProjects } },
    });

    render(<Home />);

    await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
        projectsSlice.setProjects(
            expect.arrayContaining([
            expect.objectContaining({
                id: 1,
                github: null,
                description: "Desc FR", 
            }),
            ])
        )
        );
    }); 
  });

  it("handles empty data without crashing", (): void => {
    render(<Home />);
    expect(screen.getByText("AboutMeComponent")).toBeInTheDocument();
    expect(screen.getByTestId("horizontal-scroll-skills")).toBeInTheDocument();
    expect(screen.getByTestId("horizontal-scroll-projects")).toBeInTheDocument();
  });

  it("updates titles on language change", async (): Promise<void> => {
    render(<Home />);
    await waitFor((): void => {
      expect(dispatchMock).toHaveBeenCalledWith(skillsSlice.updateSkillCategories("fr"));
      expect(dispatchMock).toHaveBeenCalledWith(projectsSlice.updateProjectDescriptions("fr"));
      expect(dispatchMock).toHaveBeenCalledWith(educationsSlice.updateEducationsTitle("fr"));
      expect(dispatchMock).toHaveBeenCalledWith(experiencesSlice.updateExperiences("fr"));
    });
  });

  it("formats and dispatches social data correctly", async (): Promise<void> => {
    const mockSocials: Social[] = [
      { id: 1, title: "GitHub", url: "https://github.com/Alexandre78R", tab: 3 },
      { id: 2, title: "LinkedIn", url: "https://www.linkedin.com/in/alexandrerenard/", tab: 3 },
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: { socialList: mockSocials },
    });

    render(<Home />);

    await waitFor((): void => {
      expect(dispatchMock).toHaveBeenCalledWith(
        socialsSlice.setSocials(
          expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              title: "GitHub",
              url: "https://github.com/Alexandre78R",
              tab: 3,
            }),
          ])
        )
      );
    });
  });
});