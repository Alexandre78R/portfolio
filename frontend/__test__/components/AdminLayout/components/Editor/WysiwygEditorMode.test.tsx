import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WysiwygEditorMode, {
  WysiwygEditorModeProps,
  QuillModule,
  QuillFormat,
} from "@/components/AdminLayout/components/Editor/WysiwygEditorMode";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface MockLangContext {
  readonly translations: Lang;
}

const translationsMock: Lang = {
  messageAdminEditorWysiwygHelp: "Text formatting tips",
} as Lang;

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn<MockLangContext, []>(),
}));


jest.mock("react-quill", (): object => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }): React.ReactElement => (
    <div data-testid="quill-editor">
      <textarea
        data-testid="quill-content"
        value={value}
        onChange={(e): void => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", (): object => ({
  __esModule: true,
  default: ({ children, type }: { children: React.ReactNode; type: string }): React.ReactElement => (
    <div data-testid={`text-admin-${type}`}>{children}</div>
  ),
}));

describe("WysiwygEditorMode Component", (): void => {
  let mockUseLang: jest.Mock<MockLangContext, []>;
  let mockOnChange: jest.Mock<void, [string]>;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockUseLang = useLang as jest.Mock<MockLangContext, []>;
    mockUseLang.mockReturnValue({ translations: translationsMock });

    mockOnChange = jest.fn<void, [string]>();
  });

  const createDefaultProps = (): WysiwygEditorModeProps => ({
    content: "",
    onChange: mockOnChange,
    placeholder: "Enter content...",
    modules: {
      toolbar: [["bold", "italic"]],
    } as QuillModule,
    formats: ["bold", "italic"] as QuillFormat,
  });

  describe("Rendering", (): void => {
    it("should render the Quill editor", (): void => {
      const props: WysiwygEditorModeProps = createDefaultProps();
      render(<WysiwygEditorMode {...props} />);

      expect(screen.getByTestId("quill-editor")).toBeInTheDocument();
    });

    it("should pass correct placeholder to Quill editor", (): void => {
      const customPlaceholder: string = "Custom placeholder";
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        placeholder: customPlaceholder,
      };
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.placeholder).toBe(customPlaceholder);
    });

    it("should display content in the editor", (): void => {
      const content: string = "<p>Test content</p>";
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        content,
      };
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe(content);
    });

    it("should render help text", (): void => {
      const props: WysiwygEditorModeProps = createDefaultProps();
      render(<WysiwygEditorMode {...props} />);

      expect(screen.getByText(/Text formatting tips/)).toBeInTheDocument();
    });
  });

  describe("Content Updates", (): void => {
    it("should call onChange when content is updated", (): void => {
      const props: WysiwygEditorModeProps = createDefaultProps();
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      const newContent: string = "<p>Updated</p>";

      fireEvent.change(quillContent, { target: { value: newContent } });

      expect(mockOnChange).toHaveBeenCalledWith(newContent);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange multiple times for multiple updates", (): void => {
      const props: WysiwygEditorModeProps = createDefaultProps();
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;

      fireEvent.change(quillContent, { target: { value: "<p>First</p>" } });
      fireEvent.change(quillContent, { target: { value: "<p>Second</p>" } });

      expect(mockOnChange).toHaveBeenCalledTimes(2);
      expect(mockOnChange).toHaveBeenLastCalledWith("<p>Second</p>");
    });
  });

  describe("Props Updates", (): void => {
    it("should update content when props change", (): void => {
      const initialContent: string = "<p>Initial</p>";
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        content: initialContent,
      };

      const { rerender } = render(<WysiwygEditorMode {...props} />);

      let quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe(initialContent);

      const updatedContent: string = "<p>Updated</p>";
      rerender(<WysiwygEditorMode {...props} content={updatedContent} />);

      quillContent = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe(updatedContent);
    });

    it("should handle empty content", (): void => {
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        content: "",
      };
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe("");
    });
  });

  describe("Module and Format Props", (): void => {
    it("should accept QuillModule prop", (): void => {
      const customModules: QuillModule = {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ color: [] }],
        ],
      };
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        modules: customModules,
      };

      const { container } = render(<WysiwygEditorMode {...props} />);
      expect(container).toBeInTheDocument();
    });

    it("should accept QuillFormat prop", (): void => {
      const customFormats: QuillFormat = [
        "bold",
        "italic",
        "underline",
        "color",
        "background",
      ];
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        formats: customFormats,
      };

      const { container } = render(<WysiwygEditorMode {...props} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("HTML Content Handling", (): void => {
    it("should handle HTML with special characters", (): void => {
      const htmlContent: string = "<p>&amp; &lt; &gt; &quot;</p>";
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        content: htmlContent,
      };
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe(htmlContent);
    });

    it("should handle complex HTML with nested tags", (): void => {
      const complexHtml: string = "<div><p>Nested <strong>bold</strong> text</p></div>";
      const props: WysiwygEditorModeProps = {
        ...createDefaultProps(),
        content: complexHtml,
      };
      render(<WysiwygEditorMode {...props} />);

      const quillContent: HTMLTextAreaElement = screen.getByTestId("quill-content") as HTMLTextAreaElement;
      expect(quillContent.value).toBe(complexHtml);
    });
  });

  describe("Accessibility", (): void => {
    it("should have accessible structure", (): void => {
      const props: WysiwygEditorModeProps = createDefaultProps();
      render(<WysiwygEditorMode {...props} />);

      const quillEditor: HTMLElement = screen.getByTestId("quill-editor");
      expect(quillEditor).toBeInTheDocument();
    });
  });
});
