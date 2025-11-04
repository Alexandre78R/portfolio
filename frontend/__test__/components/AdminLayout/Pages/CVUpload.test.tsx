import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CVUpdate from "@/components/AdminLayout/Pages/CV/CVUpdate";
import Lang from "@/lang/typeLang";

const uploadCvMock: jest.Mock<
  Promise<{ data?: { uploadCV?: { code: number; message: string } } }>,
  [{ variables: { file: File } }]
> = jest.fn();

const showAlertMock: jest.Mock<void, ["success" | "error", string]> = jest.fn();

jest.mock("@/types/graphql", () => ({
  useUploadCvMutation: () => [uploadCvMock],
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: () => ({ showAlert: showAlertMock }),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      messagePageCvTitle: "Upload CV",
      messagePageCvButtonSelectFile: "Select CV",
      messagePageCvConfirmTitle: "Confirm upload",
      messagePageCvConfirmDescription: "Do you want to upload this CV?",
      messagePageCvConfirmButtonYes: "Yes",
      messagePageCvConfirmButtonNo: "No",
      messagePageCvUploading: "Uploading...",
      messagePageCvUploadSuccess: "CV uploaded successfully",
      messagePageCvUploadError: "Upload failed",
    } as Lang,
  }),
}));

jest.mock("../../../../src/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: ({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }): JSX.Element | null =>
    open ? (
      <div data-testid="confirm-dialog">
        <button type="button" onClick={onConfirm}>confirm</button>
        <button type="button" onClick={onCancel}>cancel</button>
      </div>
    ) : null,
}));

jest.mock("../../../../src/components/Button/Button", () => ({
  __esModule: true,
  default: ({ onClick, text }: { onClick?: () => void; text: string }): JSX.Element => (
    <button type="button" onClick={onClick}>{text}</button>
  ),
}));

describe("CVUpdate Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial state", () => {
    render(<CVUpdate />);
    expect(screen.getByText("Upload CV")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select cv/i })).toBeInTheDocument();
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("file");
  });

  it("opens confirm dialog when selecting a file", async () => {
    render(<CVUpdate />);
    const file = new File(["test"], "test-cv.pdf", { type: "application/pdf" });
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;

    // trigger change event with TS fix
    fireEvent.change(input, { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);

    // wait for dialog to appear
    await waitFor(() => expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument());
    expect(screen.getByText("confirm")).toBeInTheDocument();
    expect(screen.getByText("cancel")).toBeInTheDocument();
  });

  it("uploads CV successfully", async () => {
    uploadCvMock.mockResolvedValue({ data: { uploadCV: { code: 200, message: "Success" } } });

    render(<CVUpdate />);
    const file = new File(["test"], "test-cv.pdf", { type: "application/pdf" });
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);

    const confirmButton: HTMLButtonElement = await screen.findByText("confirm") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(uploadCvMock).toHaveBeenCalledWith({ variables: { file } });
      expect(showAlertMock).toHaveBeenCalledWith("success", "CV uploaded successfully");
    });
  });

  it("shows error alert when upload fails", async () => {
    uploadCvMock.mockResolvedValue({ data: { uploadCV: { code: 500, message: "Failed" } } });

    render(<CVUpdate />);
    const file = new File(["test"], "test-cv.pdf", { type: "application/pdf" });
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);

    const confirmButton: HTMLButtonElement = await screen.findByText("confirm") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith("error", "Failed");
    });
  });

  it("resets selected file and closes dialog on cancel", async () => {
    render(<CVUpdate />);
    const file = new File(["test"], "test-cv.pdf", { type: "application/pdf" });
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);

    const cancelButton: HTMLButtonElement = await screen.findByText("cancel") as HTMLButtonElement;
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });
  });

  it("shows uploading message while CV is being uploaded", async () => {
    let resolveUpload!: (value: { data: { uploadCV: { code: number; message: string } } }) => void;

    const uploadPromise: Promise<{ data: { uploadCV: { code: number; message: string } } }> =
        new Promise((res) => { resolveUpload = res; });

    uploadCvMock.mockReturnValue(uploadPromise);

    render(<CVUpdate />);
    const file = new File(["test"], "test-cv.pdf", { type: "application/pdf" });
    const input: HTMLInputElement = document.getElementById("cv-input") as HTMLInputElement;

    fireEvent.change(
        input,
        { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
    );

    const confirmButton: HTMLButtonElement = await screen.findByText("confirm") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    expect(screen.getByText("Uploading...")).toBeInTheDocument();

    resolveUpload({ data: { uploadCV: { code: 200, message: "Success" } } });

    await waitFor(() => {
        expect(screen.queryByText("Uploading...")).not.toBeInTheDocument();
    });
  });
});