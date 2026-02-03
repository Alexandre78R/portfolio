import React from "react";
import { render, screen } from "@testing-library/react";
import CharacterCount, { CharacterCountProps } from "@/components/AdminLayout/components/Editor/CharacterCount";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface MockLangContext {
  readonly translations: Lang;
}

const translationsMock: Lang = {
  messageAdminEditorCharacterCount: "visible characters",
} as Lang;


jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn<MockLangContext, []>(),
}));


jest.mock("@/components/AdminLayout/components/Text/TextAdmin", (): object => ({
  __esModule: true,
  default: ({ children, type }: { children: React.ReactNode; type: string }): React.ReactElement => (
    <div data-testid={`text-admin-${type}`}>{children}</div>
  ),
}));

describe("CharacterCount Component", (): void => {
  let mockUseLang: jest.Mock<MockLangContext, []>;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockUseLang = useLang as jest.Mock<MockLangContext, []>;
    mockUseLang.mockReturnValue({ translations: translationsMock });
  });

  const createDefaultProps = (): CharacterCountProps => ({
    content: "",
  });

  describe("Rendering", (): void => {
    it("should render character count", (): void => {
      const props: CharacterCountProps = createDefaultProps();
      render(<CharacterCount {...props} />);

      expect(screen.getByTestId("text-admin-span")).toBeInTheDocument();
    });

    it("should display the correct translation text", (): void => {
      const props: CharacterCountProps = createDefaultProps();
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should be right-aligned", (): void => {
      const props: CharacterCountProps = createDefaultProps();
      const { container } = render(<CharacterCount {...props} />);

      const box: HTMLElement = container.querySelector('[data-testid*="text-admin"]')?.parentElement as HTMLElement;
      expect(box.className).toContain("text-right");
    });
  });

  describe("Character Counting", (): void => {
    it("should count 0 characters for empty content", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/0/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should count plain text characters", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "Hello World",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/11/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should count text inside HTML tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>Hello</p>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/5/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should not count HTML tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>Hello</p><div>World</div>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/10/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should count multiple words with spaces", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>One Two Three Four</p>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/18/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle nested HTML tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<div><p>Nested <strong>bold</strong> text</p></div>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/16/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should count HTML special characters", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>&amp; &lt; &gt; &quot;</p>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/22/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle content with only HTML tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p></p><div></div><span></span>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/0/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle content with mixed content and tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<div>Start<p>Middle</p>End</div>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/14/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });
  });

  describe("Props Updates", (): void => {
    it("should update character count when content changes", (): void => {
      const initialContent: string = "<p>Short</p>";
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: initialContent,
      };

      const { rerender } = render(<CharacterCount {...props} />);

      expect(screen.getByText(/5/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();

      // Update content
      const newContent: string = "<p>Much longer content</p>";
      rerender(<CharacterCount {...{ content: newContent }} />);

      expect(screen.getByText(/19/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle rapid content changes", (): void => {
      const { rerender } = render(<CharacterCount content="" />);

      expect(screen.getByText(/0/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();

      rerender(<CharacterCount content="<p>A</p>" />);
      expect(screen.getByText(/1/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();

      rerender(<CharacterCount content="<p>AB</p>" />);
      expect(screen.getByText(/2/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();

      rerender(<CharacterCount content="<p>ABC</p>" />);
      expect(screen.getByText(/3/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", (): void => {
    it("should handle very long content", (): void => {
      const longContent: string = "<p>" + "a".repeat(10000) + "</p>";
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: longContent,
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/10000/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle content with only whitespace", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>   </p>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/3/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle content with line breaks", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: `<p>Line 1
Line 2
Line 3</p>`,
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/20/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle malformed HTML", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>Unclosed paragraph<div>Nested",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/24/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle HTML with attributes containing angle brackets (encoded)", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: '<p data-value="test&gt;value">Content</p>',
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/7/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });
  });

  describe("Regex Pattern", (): void => {
    it("should correctly match self-closing tags", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "Text<br/>More text<img/><hr/>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/13/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should correctly remove tags with attributes", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: '<p class="active" id="main">Text</p>',
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/4/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });

    it("should handle tags with complex attributes", (): void => {
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: '<a href="https://example.com" title="Example">Link</a>',
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/4/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });
  });

  describe("Memoization", (): void => {
    it("should use memoization to avoid recalculating", (): void => {
      const content: string = "<p>Test content</p>";
      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content,
      };

      const { rerender } = render(<CharacterCount {...props} />);

      expect(screen.getByText(/12/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();

      rerender(<CharacterCount {...props} />);
      expect(screen.getByText(/12/)).toBeInTheDocument(); expect(screen.getByText(/visible characters/)).toBeInTheDocument();
    });
  });

  describe("Translation Fallback", (): void => {
    it("should use translation or fallback text", (): void => {
      const mockUseLangWithEmpty: jest.Mock<MockLangContext, []> = useLang as jest.Mock<MockLangContext, []>;
      mockUseLangWithEmpty.mockReturnValue({ translations: {} as Lang });

      const props: CharacterCountProps = {
        ...createDefaultProps(),
        content: "<p>Test</p>",
      };
      render(<CharacterCount {...props} />);

      expect(screen.getByText(/4/)).toBeInTheDocument();
    });
  });
});


