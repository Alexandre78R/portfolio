import React, { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import Careers from "@/components/Careers/Careers";
import { useSelector } from "react-redux";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

const mockExperiences: ExperienceType[] = [
  {
    id: 1,
    typeFR: "Expérience",
    typeEN: "Experience",
    jobFR: "Développeur Frontend",
    jobEN: "Frontend Developer",
    job: "Frontend Developer",
    employmentContractFR: "CDI",
    employmentContractEN: "Permanent contract",
    employmentContract: "CDI",
    business: "Tech Corp",
    startDateFR: "Janvier 2023",
    startDateEN: "January 2023",
    startDate: "Janvier 2023",
    endDateFR: "Décembre 2023",
    endDateEN: "December 2023",
    endDate: "Décembre 2023",
    month: 1,
    type: "Experience",
  },
];

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
    type: "Education",
  },
];

describe("Careers component", () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: (state: any) => any) =>
        selectorFn({
          educations: { dataEducations: mockEducations },
          experiences: { dataExperiences: mockExperiences },
        })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders experiences and educations", () => {
    render(<Careers /> as ReactElement);

    const expElement: HTMLElement = screen.getByText("Frontend Developer");
    const eduElement: HTMLElement = screen.getByText("Master Informatique");

    expect(expElement).toBeInTheDocument();
    expect(eduElement).toBeInTheDocument();
  });

  it("prioritizes Experience over Education when same year", () => {
    render(<Careers /> as React.ReactElement);

    const titles: HTMLElement[] = screen.getAllByText(
      /Frontend Developer|Master Informatique/
    ) as HTMLElement[];

    expect(titles[0].textContent?.trim()).toBe("Frontend Developer");
    expect(titles[1].textContent?.trim()).toBe("Master Informatique");
  });

  it("renders dates correctly", () => {
    render(<Careers /> as ReactElement);

    const expDate: HTMLElement = screen.getByText("Janvier 2023 - Décembre 2023");
    const eduDate: HTMLElement = screen.getByText("Septembre 2023 - Juin 2024");

    expect(expDate).toBeInTheDocument();
    expect(eduDate).toBeInTheDocument();
  });

  it("renders additional information fields", () => {
    render(<Careers /> as ReactElement);

    const contractEl: HTMLElement = screen.getByText("CDI");
    const businessEl: HTMLElement = screen.getByText("Tech Corp");
    const diplomaEl: HTMLElement = screen.getByText("Master");
    const schoolEl: HTMLElement = screen.getByText("Université Paris");

    expect(contractEl).toBeInTheDocument();
    expect(businessEl).toBeInTheDocument();
    expect(diplomaEl).toBeInTheDocument();
    expect(schoolEl).toBeInTheDocument();
  });
});