import React from "react";
import { render, screen } from "@testing-library/react";
import Careers from "@/components/Careers/Careers";
import { useSelector } from "react-redux";
import { EducationType } from "@/store/slices/educationsSlice";
import { ExperienceType } from "@/store/slices/experiencesSlice";

jest.mock("react-redux", () => ({
  useSelector: jest.fn() as jest.Mock,
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
  },
];

describe("Careers component", () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
      selectorFn({
        educations: { dataEducations: mockEducations } as { dataEducations: typeof mockEducations },
        experiences: { dataExperiences: mockExperiences } as { dataExperiences: typeof mockExperiences },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders experiences and educations", () => {
    render(<Careers /> as React.ReactElement);

    expect(screen.getByText("Frontend Developer" as string) as HTMLElement).toBeInTheDocument();
    expect(screen.getByText("Master Informatique" as string) as HTMLElement).toBeInTheDocument();
  });

  it("prioritizes Experience over Education when same year", () => {
    render(<Careers /> as React.ReactElement);

    const titles: HTMLElement[] = screen.getAllByText(
      /Frontend Developer|Master Informatique/ as RegExp
    )as HTMLElement[];

    expect(titles[0] as HTMLElement).toHaveTextContent("Frontend Developer" as string);
    expect(titles[1] as HTMLElement).toHaveTextContent("Master Informatique" as string);
  });

  it("renders dates correctly", () => {
    render(<Careers /> as React.ReactElement);

    expect(
      screen.getByText("Janvier 2023 - Décembre 2023" as string)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Septembre 2023 - Juin 2024" as string)
    ).toBeInTheDocument();
  });

  it("renders additional information fields", () => {
    render(<Careers /> as React.ReactElement);

    expect(screen.getByText("CDI" as string)).toBeInTheDocument();
    expect(screen.getByText("Tech Corp" as string)).toBeInTheDocument();
    expect(screen.getByText("Master" as string)).toBeInTheDocument();
    expect(screen.getByText("Université Paris" as string)).toBeInTheDocument();
  });
});