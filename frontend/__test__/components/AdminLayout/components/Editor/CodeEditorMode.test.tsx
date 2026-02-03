import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeEditorMode, {
  CodeEditorModeProps,
} from "@/components/AdminLayout/components/Editor/CodeEditorMode";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface MockLangContext {
  readonly translations: Lang;
}

const translationsMock: Lang = {
  messageAdminEditorCodeTitle: "HTML Editor",
  messageAdminEditorCodeHelp: "Tip: Access tags with Ctrl+/",
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

describe("CodeEditorMode Component", (): void => {
  let mockUseLang: jest.Mock<MockLangContext, []>;
  let mockOnChange: jest.Mock<void, [string]>;
  let mockOnKeyDown: jest.Mock<void, [React.KeyboardEvent<HTMLTextAreaElement>]>;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockUseLang = useLang as jest.Mock<MockLangContext, []>;
    mockUseLang.mockReturnValue({ translations: translationsMock });

    mockOnChange = jest.fn<void, [string]>();
    mockOnKeyDown = jest.fn<void, [React.KeyboardEvent<HTMLTextAreaElement>]>();
  });

  const createDefaultProps = (): CodeEditorModeProps => ({
    content: "",
    onChange: mockOnChange,
    onKeyDown: mockOnKeyDown,
  });

  describe("Rendering", (): void => {
    it("should render the code textarea", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      expect(screen.getByLabelText("HTML code editor")).toBeInTheDocument();
    });

    it("should display title", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      expect(screen.getByText("HTML Editor")).toBeInTheDocument();
    });

    it("should display help text", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      expect(screen.getByText(/Tip: Access tags with Ctrl/)).toBeInTheDocument();
    });

    it("should have correct CSS classes for styling", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.className).toContain("w-full");
      expect(textarea.className).toContain("h-96");
      expect(textarea.className).toContain("font-mono");
    });

    it("should have spellCheck disabled", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.getAttribute("spellcheck")).toBe("false");
    });
  });

  describe("Content Management", (): void => {
    it("should display initial content", (): void => {
      const content: string = "<p>Initial HTML</p>";
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content,
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(content);
    });

    it("should call onChange when content is updated", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      const newContent: string = "<div>New content</div>";

      fireEvent.change(textarea, { target: { value: newContent } });

      expect(mockOnChange).toHaveBeenCalledWith(newContent);
    });

    it("should handle empty content", (): void => {
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: "",
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe("");
    });

    it("should handle very long HTML content", (): void => {
      const longContent: string = "<p>" + "a".repeat(5000) + "</p>";
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: longContent,
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(longContent);
    });
  });

  describe("Keyboard Handlers", (): void => {
    it("should call onKeyDown when key is pressed", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;

      fireEvent.keyDown(textarea, { key: ">" });

      expect(mockOnKeyDown).toHaveBeenCalled();
    });

    it("should call onKeyDown for Enter key", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;

      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(mockOnKeyDown).toHaveBeenCalled();
    });

    it("should call onKeyDown for multiple key presses", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;

      fireEvent.keyDown(textarea, { key: ">" });
      fireEvent.keyDown(textarea, { key: "Enter" });
      fireEvent.keyDown(textarea, { key: "Backspace" });

      expect(mockOnKeyDown).toHaveBeenCalledTimes(3);
    });
  });

  describe("Props Updates", (): void => {
    it("should update content when props change", (): void => {
      const initialContent: string = "<p>Initial</p>";
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: initialContent,
      };

      const { rerender } = render(<CodeEditorMode {...props} />);

      let textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(initialContent);

      const updatedContent: string = "<div>Updated</div>";
      rerender(<CodeEditorMode {...props} content={updatedContent} />);

      textarea = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(updatedContent);
    });

    it("should update onChange callback when props change", (): void => {
      const newOnChange: jest.Mock<void, [string]> = jest.fn<void, [string]>();
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        onChange: mockOnChange,
      };

      const { rerender } = render(<CodeEditorMode {...props} />);

      rerender(<CodeEditorMode {...props} onChange={newOnChange} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "<p>Test</p>" } });

      expect(newOnChange).toHaveBeenCalledWith("<p>Test</p>");
    });

    it("should update onKeyDown callback when props change", (): void => {
      const newOnKeyDown: jest.Mock<void, [React.KeyboardEvent<HTMLTextAreaElement>]> = jest.fn<
        void,
        [React.KeyboardEvent<HTMLTextAreaElement>]
      >();
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        onKeyDown: mockOnKeyDown,
      };

      const { rerender } = render(<CodeEditorMode {...props} />);

      rerender(<CodeEditorMode {...props} onKeyDown={newOnKeyDown} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      fireEvent.keyDown(textarea, { key: ">" });

      expect(newOnKeyDown).toHaveBeenCalled();
    });
  });

  describe("HTML Content Handling", (): void => {
    it("should handle HTML with special characters", (): void => {
      const htmlContent: string = "<p>&amp; &lt; &gt; &quot;</p>";
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: htmlContent,
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(htmlContent);
    });

    it("should handle complex nested HTML", (): void => {
      const complexHtml: string = `
        <div class="container">
          <p>Nested <strong>bold</strong> and <em>italic</em></p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: complexHtml,
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(complexHtml);
    });

    it("should handle HTML with attributes", (): void => {
      const htmlWithAttrs: string = '<img src="test.jpg" alt="Test" class="img-class" />';
      const props: CodeEditorModeProps = {
        ...createDefaultProps(),
        content: htmlWithAttrs,
      };
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.value).toBe(htmlWithAttrs);
    });
  });

  describe("Accessibility", (): void => {
    it("should have aria-label", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.getAttribute("aria-label")).toBe("HTML code editor");
    });

    it("should be focusable", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });
  });

  describe("Visual Styling", (): void => {
    it("should apply dark theme classes", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.className).toContain("bg-gray-800");
      expect(textarea.className).toContain("text-white");
      expect(textarea.className).toContain("border-gray-600");
    });

    it("should have monospace font", (): void => {
      const props: CodeEditorModeProps = createDefaultProps();
      render(<CodeEditorMode {...props} />);

      const textarea: HTMLTextAreaElement = screen.getByLabelText("HTML code editor") as HTMLTextAreaElement;
      expect(textarea.className).toContain("font-mono");
    });
  });
});


