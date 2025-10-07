import React from "react";
import { render, screen } from "@testing-library/react";
import Skills from "@/components/Skills/Skills";

const mockSkills: Array<{ name: string; image: string }> = [
  { name: "React" as const, image: "/react.png" as const },
  { name: "TypeScript" as const, image: "/typescript.png" as const },
  { name: "Tailwind" as const, image: "/tailwind.png" as const },
  { name: "NodeJS" as const, image: "/nodejs.png" as const },
];

const mockCategory: string = "Frontend";

describe("Skills Component", () => {
  it("renders the category correctly", () => {
    render(<Skills category={mockCategory} skills={mockSkills} />);
    expect(screen.getByText(mockCategory)).toBeInTheDocument();
  });

  it("renders all skill images with correct alt and src", () => {
    render(<Skills category={mockCategory} skills={mockSkills} /> as React.ReactElement);

    const images: Array<HTMLImageElement> = screen.getAllByRole("img" as string) as Array<HTMLImageElement>;
    expect(images.length as number).toBe(mockSkills.length as number);

    mockSkills.forEach((skill) => {
      const img: HTMLImageElement = screen.getByAltText(skill.name as string) as HTMLImageElement;
      expect(img as HTMLElement).toBeInTheDocument();
      expect(img.src as string).toContain(skill.image as string);
    });
  });

  it("renders skills in pairs (flex layout)", () => {
    render(<Skills category={mockCategory} skills={mockSkills} /> as React.ReactElement);

    const pairDivs: HTMLElement[] = screen.getAllByRole("img" as string).filter((img, index) => index % 2 === 0);
    expect(pairDivs.length as number).toBe(Math.ceil(mockSkills.length / 2));
  });
});