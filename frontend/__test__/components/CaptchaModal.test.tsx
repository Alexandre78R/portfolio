import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import CaptchaModal, { ContactProps } from "@/components/Captcha/Captcha";
import { CaptchaImage } from "@/types/graphql";
import Lang from "@/lang/typeLang";
import ReactDOM from "react-dom";

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

/* ------------------------------ GraphQL mocks ------------------------------ */

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
  useGenerateCaptchaQuery: (): { refetch: jest.Mock } => ({ refetch: mockRefetch }),
  useValidateCaptchaMutation: (): [jest.Mock] => [mockValidateCaptcha],
  useClearCaptchaMutation: (): [jest.Mock] => [mockClearCaptcha],
}));

/* ---------------------------- Helper render ---------------------------- */

const renderComponent = (props?: Partial<ContactProps>): RenderResult => {
  const defaultProps: ContactProps = {
    open: true,
    onClose: jest.fn(),
    onValidate: jest.fn(),
    authorizeGenerateCaptcha: true,
    setAuthorizeGenerateCaptcha: jest.fn(),
  };

  return render(<CaptchaModal {...defaultProps} {...props} />);
};

/* ------------------------------- Tests ------------------------------- */

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
          setTimeout(() => this.onload(), 0); // simulate instant load
        }
      },
    });
  });

  it("displays the loader on initial render", (): void => {
    renderComponent();
    const loader: HTMLElement = screen.getByRole("progressbar");
    expect(loader).toBeInTheDocument();
  });

  it("loads and displays all captcha images", async (): Promise<void> => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Select all/i)).toBeInTheDocument();
    });

    const images: HTMLImageElement[] = screen.getAllByRole("img") as HTMLImageElement[];
    expect(images).toHaveLength(mockCaptchaImages.length);
    expect(images[0].src).toContain("img-1.jpg");
  });

  it("displays the correct category name based on challengeType", async (): Promise<void> => {
    renderComponent();
    await waitFor(() => {
      const categoryText: HTMLElement = screen.getByText(/cats/i);
      expect(categoryText).toBeInTheDocument();
    });
  });

  it("selects and deselects multiple images", async (): Promise<void> => {
    renderComponent();
    const images: HTMLImageElement[] = await screen.findAllByRole("img") as HTMLImageElement[];

    fireEvent.click(images[2]);
    fireEvent.click(images[3]);
    fireEvent.click(images[4]);

    const selectedIcons: HTMLElement[] = screen.getAllByTestId("CheckCircleIcon") as HTMLElement[];
    expect(selectedIcons.length).toBe(3);

    fireEvent.click(images[3]);
    expect(screen.getAllByTestId("CheckCircleIcon").length).toBe(2);
  });

  it("submits the captcha successfully", async (): Promise<void> => {
    mockValidateCaptcha.mockImplementation(({ onCompleted }: { onCompleted: Function }) => {
      onCompleted({ validateCaptcha: { isValid: true } });
    });

    const onValidate: jest.Mock = jest.fn();
    const onClose: jest.Mock = jest.fn();

    renderComponent({ onValidate, onClose });

    const images: HTMLImageElement[] = await screen.findAllByRole("img") as HTMLImageElement[];
    fireEvent.click(images[2]);

    fireEvent.click(screen.getByRole("button", { name: /vérification/i }));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Captcha valid");
      expect(onValidate).toHaveBeenCalledWith(true);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("displays an error if the captcha is invalid", async (): Promise<void> => {
    mockValidateCaptcha.mockImplementation(({ onCompleted }: { onCompleted: Function }) => {
      onCompleted({ validateCaptcha: { isValid: false } });
    });

    renderComponent();
    fireEvent.click(await screen.findByRole("button", { name: /vérification/i }));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Captcha incorrect");
    });
  });

  it("refreshes the captcha when clicking the refresh button", async (): Promise<void> => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-mock")).not.toBeInTheDocument();
    });

    const refreshButton: HTMLButtonElement = screen.getByTestId(
      "Contact-refresh-button"
    ) as HTMLButtonElement;

    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockClearCaptcha).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});