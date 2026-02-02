import React, { ReactElement } from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import "@testing-library/jest-dom";

import EducationEditModal from "@/components/AdminLayout/components/Education/EducationEditModal";
import type { EducationRow } from "@/components/AdminLayout/components/Education/EducationTable";
import type Lang from "@/lang/typeLang";

const translationsMock: Lang = {
  messageAdminEducationEditTitle: "Edit Education",
  messageAdminEducationEditSuccess: "Education updated successfully",
  messageAdminEducationEditError: "Update failed",
  messageAdminEducationEditCancel: "Cancel",
  messageAdminEducationEditConfirm: "Save Changes",
} as Lang;

const mockEducationData: EducationRow = {
  id: 1,
  school: "Sorbonne Université",
  location: "Paris 5e",
  titleFR: "Master Informatique",
  titleEN: "Master CS",
  diplomaLevelFR: "Master 2",
  diplomaLevelEN: "Master's Degree",
  year: 2024,
  month: 9,
  typeFR: "Diplôme",
  typeEN: "Degree",
};

const mockShowAlert: jest.Mock<void, ["success" | "error", string]> = jest.fn();

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(() => ({
    translations: translationsMock,
  })),
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: jest.fn(() => ({ showAlert: mockShowAlert })),
}));

const mockUpdateMutation: jest.Mock<any, any[]> = jest.fn();
const mockUseGetEducationQuery: jest.Mock = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateEducationAdmin: jest.fn(() => [mockUpdateMutation] as const),
}));

jest.mock("@/types/graphql", () => ({
  __esModule: true,
  ...jest.requireActual("@/types/graphql"),
  useGetEducationByIdQuery: jest.fn(() => mockUseGetEducationQuery()),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: ({ children, onClose }: { children: React.ReactNode; onClose: () => void }): ReactElement => (
    <div data-testid="modal-custom">
      <button data-testid="close-btn" onClick={onClose}>X</button>
      <div data-testid="modal-content">{children}</div>
    </div>
  ),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): ReactElement => <div data-testid="loading-custom" />,
}));

jest.mock("@/components/InputField/InputField", () => ({
  __esModule: true,
  default: ({ id, name, value, onChange }: { 
    id: string; 
    name: string; 
    value: string; 
    onChange: any; 
  }): ReactElement => (
    <div data-testid={`input-field-${id}`}>
      <input 
        id={id}
        name={name}
        value={value}
        data-testid={`input-${id}`}
        onChange={onChange}
      />
    </div>
  ),
}));

jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ text, onClick, type }: { 
    text: string; 
    onClick?: () => void; 
    type?: "button" | "submit" | "reset" 
  }): ReactElement => (
    <button 
      data-testid={`btn-${text.toLowerCase().replace(/\s+/g, '-')}`}
      type={type ?? "button"} 
      onClick={onClick}
    >
      {text}
    </button>
  ),
}));

jest.mock("@/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): ReactElement => (
    <h2 data-testid="text-admin">{children}</h2>
  ),
}));

describe("EducationEditModal Component", () => {
  let mockOnCloseCallback: jest.Mock<void, []>;
  let mockOnRefreshCallback: jest.Mock<Promise<void>, []>;

  beforeEach((): void => {
    mockOnCloseCallback = jest.fn();
    mockOnRefreshCallback = jest.fn().mockResolvedValue(undefined);
    
    mockUseGetEducationQuery.mockReturnValue({
      data: { getEducationById: { education: mockEducationData } },
      loading: false,
    } as any);

    mockUpdateMutation.mockResolvedValue({ data: { updateEducation: { code: 200 } } });
    
    const { useUpdateEducationAdmin } = require("@/utils/hooks");
    (useUpdateEducationAdmin as jest.Mock).mockReturnValue([mockUpdateMutation]);
    
    jest.clearAllMocks();
  });

  it("renders nothing when education prop is null", (): void => {
    mockUseGetEducationQuery.mockReturnValue({ data: null, loading: false } as any);
    render(<EducationEditModal 
      education={null} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const modalElement: HTMLElement | null = screen.queryByTestId("modal-custom");
    expect(modalElement).not.toBeInTheDocument();
  });

  it("renders loading state during data fetch", (): void => {
    mockUseGetEducationQuery.mockReturnValue({ data: null, loading: true } as any);
    render(<EducationEditModal 
      education={mockEducationData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    expect(screen.getByTestId("modal-custom")).toBeInTheDocument();
    expect(screen.getByTestId("loading-custom")).toBeInTheDocument();
  });

  it("renders form with pre-filled data", (): void => {
    render(<EducationEditModal 
      education={mockEducationData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const schoolInputElement: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    const saveButtonElement: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    expect(schoolInputElement).toHaveValue("Sorbonne Université");
    expect(saveButtonElement).toBeInTheDocument();
  });

  it("handles input value changes correctly", (): void => {
    render(<EducationEditModal 
      education={mockEducationData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const schoolInputElement: HTMLInputElement = screen.getByTestId("input-school") as HTMLInputElement;
    fireEvent.change(schoolInputElement, { 
      target: { 
        name: "school",
        value: "ESPCI ParisTech" 
      } 
    });
    expect(schoolInputElement).toHaveValue("ESPCI ParisTech");
  });

  it("closes modal when close button clicked", (): void => {
    render(<EducationEditModal 
      education={mockEducationData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const closeButtonElement: HTMLButtonElement = screen.getByTestId("close-btn") as HTMLButtonElement;
    fireEvent.click(closeButtonElement);
    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it("submits form successfully and triggers refresh/close", async (): Promise<void> => {
    mockUpdateMutation.mockResolvedValue({ data: { updateEducation: { code: 200 } } });
    
    render(<EducationEditModal 
        education={mockEducationData} 
        onClose={mockOnCloseCallback} 
        onRefresh={mockOnRefreshCallback} 
    />);

    const submitButtonElement: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    
    await act(async () => {
        fireEvent.click(submitButtonElement);
    });

    await waitFor(() => {
        expect(mockUpdateMutation).toHaveBeenCalledTimes(1);
        expect(mockShowAlert).toHaveBeenCalledWith("success", "Education updated successfully");
    }, { timeout: 2000 });

    await waitFor(() => {
        expect(mockOnRefreshCallback).toHaveBeenCalledTimes(1);
        expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it("handles form submission error", async (): Promise<void> => {
    mockUpdateMutation.mockRejectedValueOnce(new Error("Network error"));
    
    render(<EducationEditModal 
      education={mockEducationData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);

    const submitButtonElement: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    
    await act(async () => {
      fireEvent.click(submitButtonElement);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Update failed");
    }, { timeout: 2000 });
  });
});
