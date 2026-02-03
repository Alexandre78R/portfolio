import { type ReactElement } from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import "@testing-library/jest-dom";
import ExperienceEditModal from "@/components/AdminLayout/components/Experience/ExperienceEditModal";
import type { ExperienceRow } from "@/components/AdminLayout/components/Experience/ExperienceTable";
import type Lang from "@/lang/typeLang";

const translationsMock: Lang = {
  messageAdminExperienceEditTitle: "Edit Experience",
  messageAdminExperienceEditSuccess: "Experience updated successfully",
  messageAdminExperienceEditError: "Update failed",
  messageAdminExperienceEditCancel: "Cancel",
  messageAdminExperienceEditConfirm: "Save Changes",
} as Lang;

const mockExperienceData: ExperienceRow = {
  id: 1,
  jobFR: "Développeur Frontend",
  jobEN: "Frontend Developer",
  business: "TechCorp",
  employmentContractFR: "CDI",
  employmentContractEN: "Permanent Contract",
  startDateFR: "2020-01-01",
  startDateEN: "2020-01-01",
  endDateFR: "2023-12-31",
  endDateEN: "2023-12-31",
  month: 12,
  typeFR: "Expérience professionnelle",
  typeEN: "Professional Experience",
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
const mockUseGetExperienceQuery: jest.Mock = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useUpdateExperienceAdmin: jest.fn(() => [mockUpdateMutation] as const),
}));

jest.mock("@/types/graphql", () => ({
  __esModule: true,
  ...jest.requireActual("@/types/graphql"),
  useGetExperienceByIdQuery: jest.fn(() => mockUseGetExperienceQuery()),
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
  default: ({ text, onClick, type, disable }: { 
    text: string; 
    onClick?: () => void; 
    type?: "button" | "submit" | "reset";
    disable?: boolean;
  }): ReactElement => (
    <button 
      data-testid={`btn-${text.toLowerCase().replace(/\s+/g, '-')}`}
      type={type ?? "button"} 
      onClick={onClick}
      disabled={disable}
    >
      {text}
    </button>
  ),
}));

describe("ExperienceEditModal Component", () => {
  let mockOnCloseCallback: jest.Mock<void, []>;
  let mockOnRefreshCallback: jest.Mock<Promise<void>, []>;

  beforeEach((): void => {
    mockOnCloseCallback = jest.fn();
    mockOnRefreshCallback = jest.fn().mockResolvedValue(undefined);
    
    mockUseGetExperienceQuery.mockReturnValue({
      data: { getExperienceById: { experience: mockExperienceData } },
      loading: false,
    } as any);

    mockUpdateMutation.mockResolvedValue({ data: { updateExperience: { code: 200 } } });
    
    const { useUpdateExperienceAdmin } = require("@/utils/hooks");
    (useUpdateExperienceAdmin as jest.Mock).mockReturnValue([mockUpdateMutation]);
    
    jest.clearAllMocks();
  });

  it("renders nothing when experience prop is null", (): void => {
    mockUseGetExperienceQuery.mockReturnValue({ data: null, loading: false } as any);
    render(<ExperienceEditModal 
      experience={null} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const modalElement: HTMLElement | null = screen.queryByTestId("modal-custom");
    expect(modalElement).not.toBeInTheDocument();
  });

  it("renders loading state during data fetch", (): void => {
    mockUseGetExperienceQuery.mockReturnValue({ data: null, loading: true } as any);
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    expect(screen.getByTestId("modal-custom")).toBeInTheDocument();
    expect(screen.getByTestId("loading-custom")).toBeInTheDocument();
  });

  it("renders form with pre-filled data", (): void => {
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const jobFRInput: HTMLInputElement = screen.getByTestId("input-jobFR") as HTMLInputElement;
    const saveButton: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    expect(jobFRInput).toHaveValue("Développeur Frontend");
    expect(saveButton).toBeInTheDocument();
  });

  it("handles input value changes correctly", (): void => {
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const jobFRInput: HTMLInputElement = screen.getByTestId("input-jobFR") as HTMLInputElement;
    fireEvent.change(jobFRInput, { 
      target: { 
        name: "jobFR",
        value: "Nouveau poste FR" 
      } 
    });
    expect(jobFRInput).toHaveValue("Nouveau poste FR");
  });

  it("closes modal when close button clicked", (): void => {
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);
    const closeButton: HTMLButtonElement = screen.getByTestId("close-btn") as HTMLButtonElement;
    fireEvent.click(closeButton);
    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it("submits form successfully and triggers refresh/close", async (): Promise<void> => {
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);

    const submitButton: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledTimes(1);
      expect(mockShowAlert).toHaveBeenCalledWith("success", "Experience updated successfully");
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(mockOnRefreshCallback).toHaveBeenCalledTimes(1);
      expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });

  it("handles form submission error", async (): Promise<void> => {
    mockUpdateMutation.mockRejectedValueOnce(new Error("Network error"));
    
    render(<ExperienceEditModal 
      experience={mockExperienceData} 
      onClose={mockOnCloseCallback} 
      onRefresh={mockOnRefreshCallback} 
    />);

    const submitButton: HTMLButtonElement = screen.getByTestId("btn-save-changes") as HTMLButtonElement;
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith("error", "Update failed");
    }, { timeout: 2000 });
  });
});
