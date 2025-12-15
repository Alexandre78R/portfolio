import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "@/components/Contact/Contact";
import { LangContextType, useLang } from "@/context/Lang/LangContext";
import { useSendContactMutation } from "@/types/graphql";
import CaptchaModal from "@/components/Captcha/Captcha";
import Lang from "@/lang/typeLang";

const mockShowAlert: jest.Mock<void, [type: string, message: string]> = jest.fn();
let captchaTriggered = false;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => {
  return jest.fn().mockImplementation(() => ({
    showAlert: mockShowAlert,
  }));
});

jest.mock("@/types/graphql", () => ({
  useSendContactMutation: jest.fn(),
}));

jest.mock("@/components/Captcha/Captcha", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      open,
      onValidate,
    }: {
      open: boolean;
      onValidate?: (success: boolean) => void;
    }) => {
      React.useEffect(() => {
        if (open && onValidate && !captchaTriggered) {
          captchaTriggered = true;
          onValidate(true);
        }
      }, [open, onValidate]);

      return null;
    }
  ),
}));


interface SendContactResponse {
  sendContact: {
    status: boolean;
  };
}

describe("Contact Component", () => {
  const translationsMock = {
    nameFormulaireContact: "Contact Form",
    inputNameContactEmail: "Email",
    inputNameContactObject: "Subject",
    inputNameContactMessage: "Message",
    buttonSendMessageContact: "Send",
    messageSuccessFormulaireSend: "Success!",
    messageErrorNotSend: "Error sending!",
    messageErrorFillAllInput: "Fill all fields",
    messageErrorFormatEmail: "Invalid email",
    messageErrorServerOff: "Server error",
  } as Lang;

  beforeEach(() => {
    jest.clearAllMocks();
    captchaTriggered = false;

    (useLang as jest.Mock<LangContextType>).mockReturnValue({
    lang: "fr",
    setLang: jest.fn(),
    translations: translationsMock,
    listLang: ["fr", "en"],
    });

    (useSendContactMutation as jest.Mock).mockReturnValue([jest.fn()]);
  });

  test("renders all form fields and button", () => {
    render(<Contact />);

    const emailInput: HTMLInputElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactEmail,
    }) as HTMLInputElement;

    const objectInput: HTMLInputElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactObject,
    }) as HTMLInputElement;

    const messageInput: HTMLTextAreaElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactMessage,
    }) as HTMLTextAreaElement;

    const sendButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.buttonSendMessageContact,
    }) as HTMLButtonElement;

    expect(emailInput).toBeInTheDocument();
    expect(objectInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test("shows error if fields are empty on submit", () => {
    render(<Contact />);

    const sendButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.buttonSendMessageContact,
    }) as HTMLButtonElement;

    fireEvent.click(sendButton);

    expect(mockShowAlert).toHaveBeenCalledWith(
      "error",
      translationsMock.messageErrorFillAllInput
    );
  });

  test("shows error if email format is invalid", () => {
    render(<Contact />);

    const emailInput: HTMLInputElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactEmail,
    }) as HTMLInputElement;
    const objectInput: HTMLInputElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactObject,
    }) as HTMLInputElement;
    const messageInput: HTMLTextAreaElement = screen.getByRole("textbox", {
      name: translationsMock.inputNameContactMessage,
    }) as HTMLTextAreaElement;
    const sendButton: HTMLButtonElement = screen.getByRole("button", {
      name: translationsMock.buttonSendMessageContact,
    }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(objectInput, { target: { value: "Hello" } });
    fireEvent.change(messageInput, { target: { value: "Message" } });
    fireEvent.click(sendButton);

    expect(mockShowAlert).toHaveBeenCalledWith(
      "error",
      translationsMock.messageErrorFormatEmail
    );
  });

  test("opens captcha when form is valid", () => {
    render(<Contact />);

    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactEmail }), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactObject }), {
      target: { value: "Hello" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactMessage }), {
      target: { value: "Message" },
    });

    fireEvent.click(screen.getByRole("button", { name: translationsMock.buttonSendMessageContact }));

    expect(CaptchaModal).toHaveBeenCalled();
  });

  test("calls sendContact mutation when captcha is valid", async () => {
    const fakeData: SendContactResponse = { sendContact: { status: true } };

    const sendContactMock: jest.Mock<void, [options: { onCompleted: (data: SendContactResponse) => void }]> = jest
      .fn()
      .mockImplementation(({ onCompleted }) => {
        onCompleted(fakeData);
      });

    (useSendContactMutation as jest.Mock).mockReturnValue([sendContactMock]);

    render(<Contact />);

    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactEmail }), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactObject }), {
      target: { value: "Hello" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: translationsMock.inputNameContactMessage }), {
      target: { value: "Message" },
    });

    fireEvent.click(screen.getByRole("button", { name: translationsMock.buttonSendMessageContact }));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "success",
        translationsMock.messageSuccessFormulaireSend
      );
    });

    expect(sendContactMock).toHaveBeenCalled();
  });
});
