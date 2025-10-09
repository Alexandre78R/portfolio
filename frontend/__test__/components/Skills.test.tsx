import React from "react";
import { render, screen } from "@testing-library/react";
import Skills from "@/components/Skills/Skills";
import { skill } from "@/components/Skills/typeSkills";

const mockSkills: skill[] = [
  { name: "React", image: "/react.png"},
  { name: "TypeScript", image: "/typescript.png"},
  { name: "Tailwind", image: "/tailwind.png"},
  { name: "NodeJS", image: "/nodejs.png"},
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