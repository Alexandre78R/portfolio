import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import MessageCreate from "@/components/AdminLayout/Pages/Messages/MessageCreate";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useSendMessageMutation,
  SendMessageMutation,
  SendMessageMutationVariables,
} from "@/types/graphql";
import { FetchResult } from "@apollo/client";
import Lang from "@/lang/typeLang";
import showAlert, { ToastShowAlert } from "@/components/ToastCustom/CustomToast";

interface MockLangContext {
  readonly translations: Lang;
}

interface MockMutationFunction {
  (options: { variables: SendMessageMutationVariables }): Promise<FetchResult<SendMessageMutation>>;
}

const translationsMock: Lang = {
  messageAdminMessageCreateTitle: "Create Message",
  messageAdminMessageSuccess: "Message sent successfully",
  messageAdminMessageError: "Failed to send message",
  messageAdminMessageSendError: "Error while sending message",
  messageAdminMessageSubject: "Subject",
  messageAdminMessageRecipients: "Recipients",
  messageAdminMessageContent: "Content",
  messageAdminMessageSend: "Send",
  messageAdminMessageSubjectRequired: "Subject is required",
  messageAdminMessageContentRequired: "Content is required",
  messageAdminMessageRecipientsRequired: "Recipients are required",
  messageAdminMessagePlaceholderSubject: "Enter the subject",
  messageAdminMessagePlaceholderRecipients: "Enter recipients",
  messageAdminEditorCodeTitle: "HTML Editor",
} as Lang;

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn<MockLangContext, []>(),
}));

jest.mock("@/components/ToastCustom/CustomToast", (): object => ({
  __esModule: true,
  default: jest.fn<ToastShowAlert, []>(),
}));

jest.mock("@/types/graphql", (): object => ({
  useSendMessageMutation: jest.fn<
    [MockMutationFunction, { loading: boolean }],
    []
  >(),
}));

jest.mock("@/components/AdminLayout/components/Editor/HtmlEditor", (): object => ({
  __esModule: true,
  default: ({ content, onChange }: { content: string; onChange: (value: string) => void }): React.ReactElement => (
    <textarea
      data-testid="html-editor"
      value={content}
      onChange={(e): void => onChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", (): object => ({
  __esModule: true,
  default: (): React.ReactElement => <div data-testid="loading-component">Loading...</div>,
}));

describe("MessageCreate Component", (): void => {
  let mockSendMessage: jest.Mock<Promise<FetchResult<SendMessageMutation>>, [{ variables: SendMessageMutationVariables }]>;
  let mockShowAlert: jest.Mock<void, ["success" | "error", string]>;
  let mockUseLang: jest.Mock<MockLangContext, []>;

  const getSubjectInput = (): HTMLInputElement => screen.getByRole("textbox", { name: /subject/i }) as HTMLInputElement;
  const getRecipientsInput = (): HTMLInputElement => screen.getByRole("textbox", { name: /recipients/i }) as HTMLInputElement;
  const getHtmlEditor = (): HTMLTextAreaElement => screen.getByTestId("html-editor") as HTMLTextAreaElement;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockUseLang = useLang as jest.Mock<MockLangContext, []>;
    mockUseLang.mockReturnValue({ translations: translationsMock });

    mockShowAlert = jest.fn<void, ["success" | "error", string]>();
    const mockCustomToast: jest.Mock<ToastShowAlert, []> = CustomToast as jest.Mock<ToastShowAlert, []>;
    mockCustomToast.mockReturnValue({ showAlert: mockShowAlert });

    mockSendMessage = jest.fn<Promise<FetchResult<SendMessageMutation>>, [{ variables: SendMessageMutationVariables }]>();
    const mockUseSendMessage: jest.Mock<[MockMutationFunction, { loading: boolean }], []> = useSendMessageMutation as jest.Mock<
      [MockMutationFunction, { loading: boolean }],
      []
    >;
    mockUseSendMessage.mockReturnValue([mockSendMessage, { loading: false }]);
  });

  describe("Rendering", (): void => {
    it("should render the form with all required fields", (): void => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      expect(screen.getByRole("textbox", { name: /subject/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /recipients/i })).toBeInTheDocument();
      expect(screen.getByLabelText("Content")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("should display the correct title", (): void => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      expect(screen.getByText("Create Message")).toBeInTheDocument();
    });

    it("should render loading state when mutation is loading", (): void => {
      const mockUseSendMessage: jest.Mock<[MockMutationFunction, { loading: boolean }], []> = useSendMessageMutation as jest.Mock<
        [MockMutationFunction, { loading: boolean }],
        []
      >;
      mockUseSendMessage.mockReturnValue([mockSendMessage, { loading: true }]);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    });
  });

  describe("Form Validation", (): void => {
    it("should show error when subject is empty", async (): Promise<void> => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Subject is required");
      });
    });

    it("should show error when content is empty", async (): Promise<void> => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Content is required");
      });
    });

    it("should show error when recipients is empty", async (): Promise<void> => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Recipients are required");
      });
    });

    it("should allow form submission with all valid fields", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = {
        data: {
          sendMessage: {
            code: 200,
            message: "Email sent successfully",
            __typename: "MessageResponse",
          },
        },
      };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockSendMessage).toHaveBeenCalled();
      });
    });
  });

  describe("Form Submission", (): void => {
    it("should send message with correct variables", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = {
        data: {
          sendMessage: {
            code: 200,
            message: "Email sent successfully",
            __typename: "MessageResponse",
          },
        },
      };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "user1@example.com, user2@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockSendMessage).toHaveBeenCalledWith({
          variables: {
            subject: "Test Subject",
            recipients: "user1@example.com, user2@example.com",
            content: "<p>Test content</p>",
          },
        });
      });
    });

    it("should show success message when email is sent", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = {
        data: {
          sendMessage: {
            code: 200,
            message: "Email sent successfully",
            __typename: "MessageResponse",
          },
        },
      };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("success", "Message sent successfully");
      });
    });

    it("should show error message when email sending fails", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = {
        data: {
          sendMessage: {
            code: 500,
            message: "Failed to send email",
            __typename: "MessageResponse",
          },
        },
      };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to send email");
      });
    });

    it("should reset form after successful submission", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = {
        data: {
          sendMessage: {
            code: 200,
            message: "Email sent successfully",
            __typename: "MessageResponse",
          },
        },
      };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(subjectInput.value).toBe("");
        expect(recipientsInput.value).toBe("");
        expect(htmlEditor.value).toBe("");
      });
    });
  });

  describe("Content Editor", (): void => {
    it("should update form when html editor content changes", async (): Promise<void> => {
      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();
      const testContent: string = "<p>HTML content</p>";

      await userEvent.type(htmlEditor, testContent);

      expect(htmlEditor.value).toBe(testContent);
    });
  });

  describe("Error Handling", (): void => {
    it("should handle network errors gracefully", async (): Promise<void> => {
      const error: Error = new Error("Network error");
      mockSendMessage.mockRejectedValue(error);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Network error");
      });
    });

    it("should handle missing response data", async (): Promise<void> => {
      const mockResponse: FetchResult<SendMessageMutation> = { data: undefined };
      mockSendMessage.mockResolvedValue(mockResponse);

      render(
        <MockedProvider>
          <MessageCreate />
        </MockedProvider>
      );

      const subjectInput: HTMLInputElement = getSubjectInput();
      const recipientsInput: HTMLInputElement = getRecipientsInput();
      const htmlEditor: HTMLTextAreaElement = getHtmlEditor();

      await userEvent.type(subjectInput, "Test Subject");
      await userEvent.type(recipientsInput, "test@example.com");
      await userEvent.type(htmlEditor, "<p>Test content</p>");

      const submitButton: HTMLElement = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);

      await waitFor((): void => {
        expect(mockShowAlert).toHaveBeenCalledWith("error", "Failed to send message");
      });
    });
  });
});

