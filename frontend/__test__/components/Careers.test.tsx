import React from "react";
import { render, screen } from "@testing-library/react";
import Careers from "@/components/Careers/Careers";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn() as jest.Mock,
}));

const mockExperiences: Array<{
  type: string;
  typeEN: string;
  job: string;
  business: string;
  employmentContract: string;
  startDate: string;
  endDate: string;
  startDateEN: string;
  endDateEN: string;
  month: string;
}> = [
  {
    type: "Expérience" as const,
    typeEN: "Experience" as const,
    job: "Frontend Developer" as const,
    business: "Tech Corp" as const,
    employmentContract: "CDI" as const,
    startDate: "Janvier 2023" as const,
    endDate: "Décembre 2023" as const,
    startDateEN: "January 2023" as const,
    endDateEN: "December 2023" as const,
    month: "January" as const,
  },
];

const mockEducations: Array<{
  type: string;
  typeEN: string;
  title: string;
  diplomaLevel: string;
  school: string;
  startDate: string;
  endDate: string;
  startDateEN: string;
  endDateEN: string;
  month: string;
}> = [
  {
    type: "Éducation" as const,
    typeEN: "Education" as const,
    title: "Master Informatique" as const,
    diplomaLevel: "Master" as const,
    school: "Université Paris" as const,
    startDate: "Septembre 2023" as const,
    endDate: "Juin 2024" as const,
    startDateEN: "September 2023" as const,
    endDateEN: "June 2024" as const,
    month: "September" as const,
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