import React, { ReactElement } from "react";
import { render, screen } from '@test-utils';
import "@testing-library/jest-dom";
import Skills from "@/components/Skills/Skills";
import { Skill } from "@/components/Skills/typeSkills";

interface SkillData extends Skill {
  name: string;
  image: string;
}

const mockSkills: SkillData[] = [
  { name: "React", image: "/react.png" },
  { name: "TypeScript", image: "/typescript.png" },
  { name: "Tailwind", image: "/tailwind.png" },
  { name: "NodeJS", image: "/nodejs.png" },
];

const mockCategory: string = "Frontend";

describe("Skills Component", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("renders the category correctly", (): void => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const categoryElement: HTMLElement | null = screen.queryByText(mockCategory);
    expect(categoryElement).toBeInTheDocument();
  });

  it("renders all skill images with correct alt and src", (): void => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const images: HTMLImageElement[] = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images.length).toBe(mockSkills.length);

    mockSkills.forEach((skillItem: SkillData): void => {
      const img: HTMLImageElement = screen.getByAltText(
        skillItem.name
      ) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(skillItem.image);
    });
  });

  it("renders skills in pairs (flex layout)", (): void => {
    render(<Skills category={mockCategory} skills={mockSkills} />);

    const pairDivs: HTMLElement[] = Array.from(
      screen.getAllByRole("img")
    )
      .filter((_img: Element, index: number): boolean => index % 2 === 0)
      .map((img: Element): HTMLElement => {
        const parent: HTMLElement | null = img.parentElement?.parentElement ?? null;
        if (!parent) throw new Error("Parent element not found");
        return parent;
      });

    expect(pairDivs.length).toBe(Math.ceil(mockSkills.length / 2));
  });
});
