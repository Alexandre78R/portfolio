import React, { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import Skills from "@/components/Skills/Skills";
import { Skill } from "@/components/Skills/typeSkills";

const mockSkills: Skill[] = [
  { name: "React", image: "/react.png" },
  { name: "TypeScript", image: "/typescript.png" },
  { name: "Tailwind", image: "/tailwind.png" },
  { name: "NodeJS", image: "/nodejs.png" },
];

const mockCategory: string = "Frontend";

describe("Skills Component", () => {
  it("renders the category correctly", () => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const categoryElement: HTMLElement = screen.getByText(mockCategory);
    expect(categoryElement).toBeInTheDocument();
  });

  it("renders all skill images with correct alt and src", () => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const images: HTMLImageElement[] = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.length).toBe(mockSkills.length);

    mockSkills.forEach((skillItem: Skill) => {
      const img: HTMLImageElement = screen.getByAltText(skillItem.name) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(skillItem.image);
    });
  });

  it("renders skills in pairs (flex layout)", () => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const pairDivs: HTMLElement[] = Array.from(
      screen.getAllByRole("img")
    )
      .filter((_img: Element, index: number) => index % 2 === 0)
      .map((img: Element) => img.parentElement!.parentElement as HTMLElement);

    expect(pairDivs.length).toBe(Math.ceil(mockSkills.length / 2));
  });
});