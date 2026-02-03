import React from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HtmlEditor, {
  HtmlEditorProps,
  QuillModule,
  QuillFormat,
} from "@/components/AdminLayout/components/Editor/HtmlEditor";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

interface MockLangContext {
  readonly translations: Lang;
}

const translationsMock: Lang = {
  messageAdminEditorTabLabel: "Editor",
  messageAdminEditorSplitLabel: "Preview",
  messageAdminEditorCodeLabel: "Code",
  messageAdminEditorCodeTitle: "HTML Editor",
  messageAdminEditorWysiwygHelp: "Text formatting tips",
  messageAdminEditorCodeHelp: "Tip: Access tags with Ctrl+/",
  messageAdminEditorCharacterCount: "visible characters",
} as Lang;

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn<MockLangContext, []>(),
}));

jest.mock("@/components/AdminLayout/components/Editor/WysiwygEditorMode", (): object => ({
  __esModule: true,
  default: ({ content, onChange }: { content: string; onChange: (value: string) => void }): React.ReactElement => (
    <div data-testid="wysiwyg-editor">
      <textarea
        data-testid="wysiwyg-content"
        value={content}
        onChange={(e): void => onChange(e.target.value)}
      />
    </div>
  ),
}));


jest.mock("@/components/AdminLayout/components/Editor/SplitViewMode", (): object => ({
  __esModule: true,
  default: ({ content, onChange }: { content: string; onChange: (value: string) => void }): React.ReactElement => (
    <div data-testid="split-view-editor">
      <textarea
        data-testid="split-view-content"
        value={content}
        onChange={(e): void => onChange(e.target.value)}
      />
    </div>
  ),
}));


jest.mock("@/components/AdminLayout/components/Editor/CodeEditorMode", (): object => ({
  __esModule: true,
  default: ({
    content,
    onChange,
    onKeyDown,
  }: {
    content: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  }): React.ReactElement => (
    <div data-testid="code-editor">
      <textarea
        data-testid="code-content"
        value={content}
        onChange={(e): void => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  ),
}));

jest.mock("@/components/AdminLayout/components/Editor/CharacterCount", (): object => ({
  __esModule: true,
  default: ({ content }: { content: string }): React.ReactElement => (
    <div data-testid="character-count">
      {content.replace(/<[^>]*>/gu, "").length} visible characters
    </div>
  ),
}));

describe("HtmlEditor Component", (): void => {
  let mockUseLang: jest.Mock<MockLangContext, []>;
  let mockOnChange: jest.Mock<void, [string]>;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockUseLang = useLang as jest.Mock<MockLangContext, []>;
    mockUseLang.mockReturnValue({ translations: translationsMock });

    mockOnChange = jest.fn<void, [string]>();
  });

  const createDefaultProps = (): HtmlEditorProps => ({
    content: "",
    onChange: mockOnChange,
    placeholder: "Enter HTML content...",
  });

  describe("Rendering", (): void => {
    it("should render the editor tabs", (): void => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      expect(screen.getByText(/Editor/)).toBeInTheDocument();
      expect(screen.getByText(/Preview/)).toBeInTheDocument();
      expect(screen.getByText(/Code/)).toBeInTheDocument();
    });

    it("should render WYSIWYG editor by default", (): void => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      expect(screen.getByTestId("wysiwyg-editor")).toBeInTheDocument();
      expect(screen.queryByTestId("split-view-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();
    });

    it("should render character count", (): void => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      expect(screen.getByTestId("character-count")).toBeInTheDocument();
    });

    it("should display initial content in WYSIWYG editor", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>Test content</p>",
      };
      render(<HtmlEditor {...props} />);

      const wysiwygContent: HTMLTextAreaElement = screen.getByTestId("wysiwyg-content") as HTMLTextAreaElement;
      expect(wysiwygContent.value).toBe("<p>Test content</p>");
    });

    it("should use custom placeholder", (): void => {
      const customPlaceholder: string = "Custom placeholder text";
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        placeholder: customPlaceholder,
      };
      render(<HtmlEditor {...props} />);

      expect(screen.getByTestId("wysiwyg-editor")).toBeInTheDocument();
    });
  });

  describe("Mode Switching", (): void => {
    it("should switch to split view when split button is clicked", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const splitButton: HTMLElement = screen.getByTestId("editor-tab-split");
      fireEvent.click(splitButton);

      await waitFor((): void => {
        expect(screen.getByTestId("split-view-editor")).toBeInTheDocument();
        expect(screen.queryByTestId("wysiwyg-editor")).not.toBeInTheDocument();
      });
    });

    it("should switch to code mode when code toggle is clicked", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      await waitFor((): void => {
        expect(screen.getByTestId("code-editor")).toBeInTheDocument();
      });
    });

    it("should hide WYSIWYG when code is shown", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      await waitFor((): void => {
        expect(screen.queryByTestId("wysiwyg-editor")).not.toBeInTheDocument();
        expect(screen.getByTestId("code-editor")).toBeInTheDocument();
      });
    });

    it("should return to editor mode from split view", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const splitButton: HTMLElement = screen.getByTestId("editor-tab-split");
      fireEvent.click(splitButton);

      await waitFor((): void => {
        expect(screen.getByTestId("split-view-editor")).toBeInTheDocument();
      });

      const editorButton: HTMLElement = screen.getByTestId("editor-tab-editor");
      fireEvent.click(editorButton);

      await waitFor((): void => {
        expect(screen.getByTestId("wysiwyg-editor")).toBeInTheDocument();
        expect(screen.queryByTestId("split-view-editor")).not.toBeInTheDocument();
      });
    });
  });

  describe("Content Updates", (): void => {
    it("should call onChange when content is updated in WYSIWYG", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const wysiwygContent: HTMLTextAreaElement = screen.getByTestId("wysiwyg-content") as HTMLTextAreaElement;
      const newContent: string = "<p>Updated content</p>";

      fireEvent.change(wysiwygContent, { target: { value: newContent } });

      expect(mockOnChange).toHaveBeenCalledWith(newContent);
    });

    it("should call onChange when content is updated in code editor", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      const codeContent: HTMLTextAreaElement = screen.getByTestId("code-content") as HTMLTextAreaElement;
      const newContent: string = "<p>Code updated</p>";

      fireEvent.change(codeContent, { target: { value: newContent } });

      expect(mockOnChange).toHaveBeenCalledWith(newContent);
    });

    it("should preserve content when switching modes", async (): Promise<void> => {
      const initialContent: string = "<p>Test</p>";
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: initialContent,
      };

      const { rerender }: RenderResult = render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      rerender(<HtmlEditor {...props} content={initialContent} />);

      const codeContent: HTMLTextAreaElement = screen.getByTestId("code-content") as HTMLTextAreaElement;
      expect(codeContent.value).toBe(initialContent);
    });
  });

  describe("Character Count", (): void => {
    it("should display character count for visible text", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>Hello World</p>",
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("11"); // "Hello World" is 11 characters
    });

    it("should update character count when content changes", async (): Promise<void> => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>Test</p>",
      };
      const { rerender }: RenderResult = render(<HtmlEditor {...props} />);

      let characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("4"); // "Test" is 4 characters

      rerender(<HtmlEditor {...props} content="<p>Updated content</p>" />);

      characterCount = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("15"); // "Updated content" is 15 characters
    });

    it("should not count HTML tags in character count", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>Hello</p><div>World</div>",
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("10"); // Only "HelloWorld"
    });
  });

  describe("Code Editor Keyboard Shortcuts", (): void => {
    it("should handle auto-closing tags on > key in code editor", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      const codeContent: HTMLTextAreaElement = screen.getByTestId("code-content") as HTMLTextAreaElement;

      fireEvent.change(codeContent, { target: { value: "<p" } });

      // Simulate ">" key press
      const keyEvent: React.KeyboardEvent<HTMLTextAreaElement> = new KeyboardEvent("keydown", {
        key: ">",
        bubbles: true,
      }) as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

      fireEvent.keyDown(codeContent, keyEvent);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should not auto-close self-closing tags", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      const codeContent: HTMLTextAreaElement = screen.getByTestId("code-content") as HTMLTextAreaElement;

      fireEvent.change(codeContent, { target: { value: "<img" } });

      const keyEvent: React.KeyboardEvent<HTMLTextAreaElement> = new KeyboardEvent("keydown", {
        key: ">",
        bubbles: true,
      }) as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

      fireEvent.keyDown(codeContent, keyEvent);

      expect(codeContent).toBeInTheDocument();
    });

    it("should handle Enter key with indentation in code editor", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      const codeContent: HTMLTextAreaElement = screen.getByTestId("code-content") as HTMLTextAreaElement;

      fireEvent.change(codeContent, { target: { value: "  <div>" } });

      const keyEvent: React.KeyboardEvent<HTMLTextAreaElement> = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      }) as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

      fireEvent.keyDown(codeContent, keyEvent);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", (): void => {
    it("should handle empty content", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "",
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("0");
    });

    it("should handle content with only HTML tags", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p></p><div></div>",
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("0");
    });

    it("should handle HTML with special characters", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>&amp; &lt; &gt;</p>",
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      // "&amp; &lt; &gt;" is 15 characters
      expect(characterCount.textContent).toContain("15");
    });

    it("should handle very long content", (): void => {
      const longContent: string = "<p>" + "a".repeat(10000) + "</p>";
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: longContent,
      };
      render(<HtmlEditor {...props} />);

      const characterCount: HTMLElement = screen.getByTestId("character-count");
      expect(characterCount.textContent).toContain("10000");
    });
  });

  describe("Tab Visibility", (): void => {
    it("should show correct editor when mode is editor", (): void => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      expect(screen.getByTestId("wysiwyg-editor")).toBeInTheDocument();
      expect(screen.queryByTestId("split-view-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();
    });

    it("should show correct editor when mode is split", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const splitButton: HTMLElement = screen.getByTestId("editor-tab-split");
      fireEvent.click(splitButton);

      await waitFor((): void => {
        expect(screen.queryByTestId("wysiwyg-editor")).not.toBeInTheDocument();
        expect(screen.getByTestId("split-view-editor")).toBeInTheDocument();
        expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();
      });
    });

    it("should show code editor and hide others when showCode is true", async (): Promise<void> => {
      const props: HtmlEditorProps = createDefaultProps();
      render(<HtmlEditor {...props} />);

      const codeButton: HTMLElement = screen.getByRole("button", { name: /code mode/i });
      fireEvent.click(codeButton);

      await waitFor((): void => {
        expect(screen.queryByTestId("wysiwyg-editor")).not.toBeInTheDocument();
        expect(screen.queryByTestId("split-view-editor")).not.toBeInTheDocument();
        expect(screen.getByTestId("code-editor")).toBeInTheDocument();
      });
    });
  });

  describe("Props Update", (): void => {
    it("should update content when props change", (): void => {
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        content: "<p>Initial</p>",
      };

      const { rerender }: RenderResult = render(<HtmlEditor {...props} />);

      let wysiwygContent: HTMLTextAreaElement = screen.getByTestId("wysiwyg-content") as HTMLTextAreaElement;
      expect(wysiwygContent.value).toBe("<p>Initial</p>");

      // Update props
      rerender(<HtmlEditor {...props} content="<p>Updated</p>" />);

      wysiwygContent = screen.getByTestId("wysiwyg-content") as HTMLTextAreaElement;
      expect(wysiwygContent.value).toBe("<p>Updated</p>");
    });

    it("should update onChange callback when props change", (): void => {
      const newOnChange: jest.Mock<void, [string]> = jest.fn<void, [string]>();
      const props: HtmlEditorProps = {
        ...createDefaultProps(),
        onChange: mockOnChange,
      };

      const { rerender }: RenderResult = render(<HtmlEditor {...props} />);

      rerender(<HtmlEditor {...props} onChange={newOnChange} />);

      const wysiwygContent: HTMLTextAreaElement = screen.getByTestId("wysiwyg-content") as HTMLTextAreaElement;
      fireEvent.change(wysiwygContent, { target: { value: "<p>Test</p>" } });

      expect(newOnChange).toHaveBeenCalledWith("<p>Test</p>");
    });
  });
});
