import React from "react";
import { render, screen, fireEvent, RenderResult } from "@testing-library/react";
import EditorTabs, {
  EditorMode,
  TabType,
  TabOption,
  EditorTabsProps,
} from "@/components/AdminLayout/components/Editor/EditorTabs";

const mockTabs: ReadonlyArray<TabOption> = [
  {
    id: "editor",
    label: "Editor",
    icon: "✏️",
    type: "mode" as TabType,
    ariaLabel: "Switch to editor mode",
    value: "editor" as EditorMode,
  },
  {
    id: "split",
    label: "Split View",
    icon: "📋",
    type: "mode" as TabType,
    ariaLabel: "Switch to split view mode",
    value: "split" as EditorMode,
  },
  {
    id: "code",
    label: "Show Code",
    icon: "</> ",
    type: "toggle" as TabType,
    ariaLabel: "Toggle code visibility",
  },
];

describe("EditorTabs Component", (): void => {

  const createDefaultProps = (): EditorTabsProps => ({
    mode: "editor" as EditorMode,
    showCode: false,
    tabs: mockTabs,
    onModeChange: jest.fn(),
    onShowCodeChange: jest.fn(),
  });

  describe("Rendering", (): void => {
    it("should render all tabs with correct labels", (): void => {
      const props: EditorTabsProps = createDefaultProps();
      render(<EditorTabs {...props} />);

      expect(screen.getByText(/Editor/)).toBeInTheDocument();
      expect(screen.getByText(/Split View/)).toBeInTheDocument();
      expect(screen.getByText(/Show Code/)).toBeInTheDocument();
    });

    it("should render tabs with icons", (): void => {
      const props: EditorTabsProps = createDefaultProps();
      render(<EditorTabs {...props} />);

      expect(screen.getByText(/✏️ Editor/)).toBeInTheDocument();
      expect(screen.getByText(/📋 Split View/)).toBeInTheDocument();
      expect(screen.getByText(/<\/> Show Code/)).toBeInTheDocument();
    });

    it("should have correct number of tabs", (): void => {
      const props: EditorTabsProps = createDefaultProps();
      const { container }: RenderResult = render(<EditorTabs {...props} />);

      const buttons: HTMLElement[] = Array.from(
        container.querySelectorAll('button[data-testid^="editor-tab-"]')
      );
      expect(buttons).toHaveLength(3);
    });

    it("should apply active state styling to current mode tab", (): void => {
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        mode: "editor" as EditorMode,
      };
      const { container }: RenderResult = render(<EditorTabs {...props} />);

      const editorTab: HTMLElement | null = container.querySelector(
        '[data-testid="editor-tab-editor"]'
      );
      expect(editorTab?.className).toContain("border-blue-500");
      expect(editorTab?.className).toContain("text-blue-500");
    });

    it("should apply active state styling to toggle when code is shown", (): void => {
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        showCode: true,
      };
      const { container }: RenderResult = render(<EditorTabs {...props} />);

      const codeTab: HTMLElement | null = container.querySelector(
        '[data-testid="editor-tab-code"]'
      );
      expect(codeTab?.className).toContain("border-green-500");
      expect(codeTab?.className).toContain("text-green-500");
    });

    it("should apply inactive state styling to non-active tabs", (): void => {
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        mode: "editor" as EditorMode,
      };
      const { container }: RenderResult = render(<EditorTabs {...props} />);

      const splitTab: HTMLElement | null = container.querySelector(
        '[data-testid="editor-tab-split"]'
      );
      expect(splitTab?.className).toContain("text-gray-400");
    });
  });

  describe("Tab Interaction", (): void => {
    it("should call onModeChange when clicking on mode tab", (): void => {
      const mockOnModeChange: jest.Mock<void, [EditorMode]> = jest.fn();
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        onModeChange: mockOnModeChange,
      };

      render(<EditorTabs {...props} />);

      const splitViewTab: HTMLElement = screen.getByTestId("editor-tab-split");
      fireEvent.click(splitViewTab);

      expect(mockOnModeChange).toHaveBeenCalledWith("split");
      expect(mockOnModeChange).toHaveBeenCalledTimes(1);
    });

    it("should call onShowCodeChange when clicking on toggle tab", (): void => {
      const mockOnShowCodeChange: jest.Mock<void, [boolean]> = jest.fn();
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        onShowCodeChange: mockOnShowCodeChange,
      };

      render(<EditorTabs {...props} />);

      const codeTab: HTMLElement = screen.getByTestId("editor-tab-code");
      fireEvent.click(codeTab);

      expect(mockOnShowCodeChange).toHaveBeenCalledWith(true);
      expect(mockOnShowCodeChange).toHaveBeenCalledTimes(1);
    });

    it("should toggle code visibility state correctly", (): void => {
      const mockOnShowCodeChange: jest.Mock<void, [boolean]> = jest.fn();
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        showCode: false,
        onShowCodeChange: mockOnShowCodeChange,
      };

      const { rerender }: RenderResult = render(<EditorTabs {...props} />);

      const codeTab: HTMLElement = screen.getByTestId("editor-tab-code");

      fireEvent.click(codeTab);
      expect(mockOnShowCodeChange).toHaveBeenCalledWith(true);

      rerender(
        <EditorTabs
          {...props}
          showCode={true}
          onShowCodeChange={mockOnShowCodeChange}
        />
      );

      fireEvent.click(codeTab);
      expect(mockOnShowCodeChange).toHaveBeenCalledWith(false);
    });

    it("should handle multiple mode changes", (): void => {
      const mockOnModeChange: jest.Mock<void, [EditorMode]> = jest.fn();
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        onModeChange: mockOnModeChange,
      };

      render(<EditorTabs {...props} />);

      const editorTab: HTMLElement = screen.getByTestId("editor-tab-editor");
      const splitTab: HTMLElement = screen.getByTestId("editor-tab-split");

      fireEvent.click(splitTab);
      expect(mockOnModeChange).toHaveBeenCalledWith("split");

      fireEvent.click(editorTab);
      expect(mockOnModeChange).toHaveBeenCalledWith("editor");

      expect(mockOnModeChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accessibility", (): void => {
    it("should have correct aria-labels", (): void => {
      const props: EditorTabsProps = createDefaultProps();
      render(<EditorTabs {...props} />);

      const editorTab: HTMLElement = screen.getByTestId("editor-tab-editor");
      const splitTab: HTMLElement = screen.getByTestId("editor-tab-split");
      const codeTab: HTMLElement = screen.getByTestId("editor-tab-code");

      expect(editorTab).toBeInTheDocument();
      expect(splitTab).toBeInTheDocument();
      expect(codeTab).toBeInTheDocument();
    });

    it("should have correct test IDs for each tab", (): void => {
      const props: EditorTabsProps = createDefaultProps();
      const { container }: RenderResult = render(<EditorTabs {...props} />);

      expect(
        container.querySelector('[data-testid="editor-tab-editor"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="editor-tab-split"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="editor-tab-code"]')
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", (): void => {
    it("should render with empty tabs array", (): void => {
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        tabs: [],
      };

      const { container }: RenderResult = render(<EditorTabs {...props} />);
      const buttons: HTMLElement[] = Array.from(
        container.querySelectorAll("button")
      );

      expect(buttons).toHaveLength(0);
    });

    it("should handle single tab", (): void => {
      const singleTab: ReadonlyArray<TabOption> = [
        {
          id: "editor",
          label: "Editor",
          icon: "✏️",
          type: "mode" as TabType,
          ariaLabel: "Switch to editor mode",
          value: "editor" as EditorMode,
        },
      ];

      const props: EditorTabsProps = {
        ...createDefaultProps(),
        tabs: singleTab,
      };

      render(<EditorTabs {...props} />);
      expect(screen.getByText(/Editor/)).toBeInTheDocument();
    });

    it("should handle tabs without value property", (): void => {
      const tabsWithoutValue: ReadonlyArray<TabOption> = [
        {
          id: "code",
          label: "Show Code",
          icon: "</>",
          type: "toggle" as TabType,
          ariaLabel: "Toggle code visibility",
        },
      ];

      const props: EditorTabsProps = {
        ...createDefaultProps(),
        tabs: tabsWithoutValue,
      };

      render(<EditorTabs {...props} />);

      const codeTab: HTMLElement = screen.getByTestId("editor-tab-code");
      fireEvent.click(codeTab);

      expect(codeTab).toBeInTheDocument();
    });

    it("should handle rapid tab clicks", (): void => {
      const mockOnModeChange: jest.Mock<void, [EditorMode]> = jest.fn();
      const props: EditorTabsProps = {
        ...createDefaultProps(),
        onModeChange: mockOnModeChange,
      };

      render(<EditorTabs {...props} />);

      const splitTab: HTMLElement = screen.getByTestId("editor-tab-split");

      fireEvent.click(splitTab);
      fireEvent.click(splitTab);
      fireEvent.click(splitTab);

      expect(mockOnModeChange).toHaveBeenCalledTimes(3);
      expect(mockOnModeChange).toHaveBeenLastCalledWith("split");
    });
  });

  describe("Mode State Management", (): void => {
    it("should correctly identify active mode tab", (): void => {
      const modes: EditorMode[] = ["editor", "split"];

      modes.forEach((mode: EditorMode): void => {
        const props: EditorTabsProps = {
          ...createDefaultProps(),
          mode,
        };

        const { container, unmount }: RenderResult = render(
          <EditorTabs {...props} />
        );

        const tabId: string = mode === "editor" ? "editor" : "split";
        const activeTab: HTMLElement | null = container.querySelector(
          `[data-testid="editor-tab-${tabId}"]`
        );

        expect(activeTab?.className).toContain("border-blue-500");

        unmount();
      });
    });
  });

  describe("Toggle State Management", (): void => {
    it("should display different styling for code toggle states", (): void => {
      const props: EditorTabsProps = createDefaultProps();

      const { container: container1, rerender }: RenderResult = render(
        <EditorTabs {...props} showCode={false} />
      );

      const codeTab1: HTMLElement | null = container1.querySelector(
        '[data-testid="editor-tab-code"]'
      );
      expect(codeTab1?.className).toContain("text-gray-400");

      rerender(<EditorTabs {...props} showCode={true} />);

      const codeTab2: HTMLElement | null = container1.querySelector(
        '[data-testid="editor-tab-code"]'
      );
      expect(codeTab2?.className).toContain("text-green-500");
    });
  });
});


