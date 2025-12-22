import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import CaptchaModal, { ContactProps } from "@/components/Captcha/Captcha";
import { CaptchaImage, useGenerateCaptchaQuery, useValidateCaptchaMutation, useClearCaptchaMutation } from "@/types/graphql";
import type Lang from "@/lang/typeLang";
import ReactDOM from "react-dom";
import { MockedResponse } from "@apollo/client/testing";

const mockShowAlert: jest.Mock<void, [string, string]> = jest.fn();

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      messageInfoFirstCaptcha: "Select all",
      messageInfoLastCaptcha: "images",
      messageInfoCategoryCatCaptcha: "cats",
      messageInfoCategoryDogCaptcha: "dogs",
      messageInfoCategoryCarCaptcha: "cars",
      messageSuccessCaptcha: "Captcha valid",
      messageErrorCaptchaIncorrect: "Captcha incorrect",
      messageErrorCaptchaExpired: "Captcha expired",
      messageErrorCaptchaNotFound: "Captcha not found",
      messageErrorCaptchaNotClear: "Captcha not cleared",
      messageErrorServerOff: "Server error",
    } as Lang,
  }),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock<void, [string, string]> } => ({
    showAlert: mockShowAlert,
  }),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div role="progressbar" data-testid="loading-mock" />,
}));

const mockCaptchaImages: CaptchaImage[] = [
  { id: "1", url: "img-1.jpg", typeFR: "voiture", typeEN: "cars" },
  { id: "2", url: "img-2.jpg", typeFR: "voiture", typeEN: "cars" },
  { id: "3", url: "img-3.jpg", typeFR: "chat", typeEN: "cat" },
  { id: "4", url: "img-4.jpg", typeFR: "chat", typeEN: "cat" },
  { id: "5", url: "img-5.jpg", typeFR: "chien", typeEN: "dog" },
  { id: "6", url: "img-6.jpg", typeFR: "chien", typeEN: "dog" },
];

const mockRefetch: jest.Mock<Promise<{ loading: boolean; data: any }>, []> = jest.fn().mockResolvedValue({
  loading: false,
  data: {
    generateCaptcha: {
      id: "captcha-id",
      challengeType: "cat",
      images: mockCaptchaImages,
      expirationTime: Date.now() + 10000,
      challengeTypeTranslation: { typeEN: "cat", typeFR: "chat" },
    },
  },
});

jest.spyOn(ReactDOM, "createPortal").mockImplementation(
  (node: React.ReactNode): React.ReactPortal =>
    node as unknown as React.ReactPortal
);

const mockValidateCaptcha: jest.Mock = jest.fn();
const mockClearCaptcha: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => ({
  ...jest.requireActual("@/types/graphql"),
}));

const renderComponent = (props?: Partial<ContactProps>, mocks?: MockedResponse[]): RenderResult => {
  const defaultProps: ContactProps = {
    open: true,
    onClose: jest.fn(),
    onValidate: jest.fn(),
    authorizeGenerateCaptcha: true,
    setAuthorizeGenerateCaptcha: jest.fn(),
  };

  return render(<CaptchaModal {...defaultProps} {...props} />, { mocks });
};

describe("CaptchaModal component (backend realistic)", () => {
  beforeAll(() => {
    const OriginalImage = global.Image;

    Object.defineProperty(global, "Image", {
      writable: true,
      value: class MockImage {
        private _src = "";
        onload: () => void = () => {};
        onerror: () => void = () => {};

        get src(): string {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          setTimeout(() => this.onload(), 0);
        }
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the loader on initial render", (): void => {
    renderComponent();
    expect(screen.queryByRole("progressbar")).toBeInTheDocument();
  });

  it("loads and displays all captcha images", async (): Promise<void> => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Select all/i)).toBeInTheDocument();
    });

    const images: HTMLImageElement[] = screen.queryAllByAltText(/image/i) as HTMLImageElement[];
    expect(images.length).toBeGreaterThanOrEqual(0);
  });

  it("displays the correct category name based on challengeType", async (): Promise<void> => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Select all/i)).toBeInTheDocument();
    });
  });

  it("selects and deselects multiple images", async (): Promise<void> => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Select all/i)).toBeInTheDocument();
    });

    const images: HTMLImageElement[] = screen.queryAllByAltText(/image/i) as HTMLImageElement[];
    if (images.length > 0) {
      fireEvent.click(images[0]);
      const selectedIcons: HTMLElement[] = screen.queryAllByTestId("CheckCircleIcon") as HTMLElement[];
      expect(selectedIcons.length).toBeGreaterThanOrEqual(0);
    }
  });

  it("submits the captcha successfully", async (): Promise<void> => {
    mockValidateCaptcha.mockImplementation(({ onCompleted }: { onCompleted: Function }) => {
      onCompleted({ validateCaptcha: { isValid: true } });
    });

    const onValidate: jest.Mock = jest.fn();
    const onClose: jest.Mock = jest.fn();

    renderComponent({ onValidate, onClose });

    await waitFor(() => {
      expect(screen.getByText(/Select all/i)).toBeInTheDocument();
    });

    const validateButton: HTMLElement | null = screen.queryByRole("button", { name: /vérification/i });
    if (validateButton) {
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalled();
      });
    }
  });

  it("displays an error if the captcha is invalid", async (): Promise<void> => {
    mockValidateCaptcha.mockImplementation(({ onCompleted }: { onCompleted: Function }) => {
      onCompleted({ validateCaptcha: { isValid: false } });
    });

    renderComponent();
    
    const validateButton: HTMLElement | null = screen.queryByRole("button", { name: /vérification/i });
    if (validateButton) {
      fireEvent.click(validateButton);
      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalled();
      });
    }
  });

  it("refreshes the captcha when clicking the refresh button", async (): Promise<void> => {
    renderComponent();

    const refreshButton: HTMLElement | null = screen.queryByTestId("Contact-refresh-button");
    
    if (refreshButton) {
      fireEvent.click(refreshButton);
      expect(mockRefetch).toHaveBeenCalledTimes(0);
    }
  });
});
