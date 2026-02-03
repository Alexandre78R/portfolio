import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BackUpList, { type BackupFileInfo }  from "@/components/AdminLayout/Pages/BackUp/BackUpList";
import type Lang from "@/lang/typeLang";
import { useGenerateBackupAdmin, useDeleteBackupAdmin, useListBackupsAdmin } from "@/utils/hooks";

const refetchMock: jest.Mock<Promise<void>, []> = jest.fn();
const generateBackupMock: jest.Mock<Promise<any>, []> = jest.fn();
const deleteBackupMock: jest.Mock<Promise<any>, []> = jest.fn();

jest.mock("@/utils/hooks", () => ({
  ...jest.requireActual("@/utils/hooks"),
  useListBackupsAdmin: jest.fn(),
  useGenerateBackupAdmin: jest.fn(),
  useDeleteBackupAdmin: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      messagePageBackUpListTitle: "Backups",
      messagePageBackUpListNotFound: "No backups",
      messagePageBackUpButtomCreated: "Create backup",
      messagePageBackUpCreatedSuccess: "Backup created",
      messagePageBackUpDeletedSuccess: "Backup deleted",
      messagePageBackUpTitleConfirmCreated: "Confirm create",
      messagePageBackUpDescConfirmCreated: "Create backup?",
      messagePageBackUpMessageButtonValideCreated: "Confirm",
      messagePageBackUpMessageButtonCancelCreated: "Cancel",
      messagePageBackUpTitleConfirmDeleted: "Confirm delete",
      messagePageBackUpDescConfirmDeleted: "Delete backup?",
      messagePageBackUpMessageButtonValideDeleted: "Delete",
      messagePageBackUpMessageButtonCancelDeleted: "Cancel",
      messagePageBackUpListFileName: "File",
      messagePageBackUpListSize: "Size",
      messagePageBackUpListDateCreated: "Created",
      messagePageBackUpListDateModified: "Modified",
      messagePageBackUpListAction: "Actions",
    } as Lang,
  }),
}));

jest.mock("@/components/Loading/LoadingCustom", () => ({
  __esModule: true,
  default: (): JSX.Element => <div data-testid="loading">Loading...</div>,
}));

jest.mock("../../../../src/components/AdminLayout/components/Table/Table", () => ({
  __esModule: true,
  default: ({ data }: { data: BackupFileInfo[] }): JSX.Element => (
    <div data-testid="table">
      {data.map((row: BackupFileInfo) => (
        <div key={row.fileName}>{row.fileName}</div>
      ))}
    </div>
  ),
}));

jest.mock("../../../../src/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => ({
  __esModule: true,
  default: ({
    open,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }): JSX.Element | null =>
    open ? (
      <div data-testid="confirm-dialog">
        <button type="button" onClick={onConfirm}>
          confirm
        </button>
        <button type="button" onClick={onCancel}>
          cancel
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/ToastCustom/CustomToast", () => ({
  __esModule: true,
  default: (): { showAlert: jest.Mock } => ({ showAlert: jest.fn() }),
}));

jest.mock("../../../../src/components/Button/Button", () => ({
  __esModule: true,
  default: ({
    onClick,
    text,
  }: {
    onClick?: () => void;
    text: string;
  }): JSX.Element => <button type="button" onClick={onClick}>{text}</button>,
}));

jest.mock("../../../../src/components/AdminLayout/components/Text/TextAdmin", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): JSX.Element => <div>{children}</div>,
}));

describe("BackUpList Page", (): void => {
  const mockBackups: BackupFileInfo[] = [
    {
      fileName: "backup-1.sql",
      sizeBytes: 1024,
      createdAt: "2024-01-01T10:00:00Z",
      modifiedAt: "2024-01-01T10:00:00Z",
    },
  ];

  beforeEach((): void => {
    jest.clearAllMocks();
    generateBackupMock.mockResolvedValue({ data: { generateBackup: { success: true } } });
    deleteBackupMock.mockResolvedValue({ data: { deleteBackup: { success: true } } });
    (useListBackupsAdmin as jest.Mock).mockReturnValue({
      backups: mockBackups,
      loading: false,
      refetch: refetchMock,
    });
    (useGenerateBackupAdmin as jest.Mock).mockReturnValue({
      generateBackup: generateBackupMock,
      loading: false,
    });
    (useDeleteBackupAdmin as jest.Mock).mockReturnValue({
      deleteBackup: deleteBackupMock,
      loading: false,
    });
  });

  it("renders loading state", (): void => {
    (useListBackupsAdmin as jest.Mock).mockReturnValue({ loading: true, backups: [], refetch: refetchMock });

    render(<BackUpList />);
    const loadingElement: HTMLElement = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders error state", (): void => {
    (useListBackupsAdmin as jest.Mock).mockReturnValue({ loading: false, backups: [], refetch: refetchMock, error: true });

    render(<BackUpList />);
    const errorElement: HTMLElement = screen.getByText("No backups");
    expect(errorElement).toBeInTheDocument();
  });

  it("renders backups list", (): void => {
    (useListBackupsAdmin as jest.Mock).mockReturnValue({
      loading: false,
      backups: mockBackups,
      refetch: refetchMock,
    });

    render(<BackUpList />);
    const backupItem: HTMLElement = screen.getByText("backup-1.sql");
    expect(backupItem).toBeInTheDocument();
  });

  it("opens confirm dialog when clicking create backup", (): void => {
    (useListBackupsAdmin as jest.Mock).mockReturnValue({
      loading: false,
      backups: mockBackups,
      refetch: refetchMock,
    });

    render(<BackUpList />);
    const createButton: HTMLButtonElement = screen.getByText("Create backup") as HTMLButtonElement;
    fireEvent.click(createButton);

    const dialogElement: HTMLElement = screen.getByTestId("confirm-dialog");
    expect(dialogElement).toBeInTheDocument();
  });

  it("calls generate backup mutation on confirm", async (): Promise<void> => {
    generateBackupMock.mockResolvedValue({ data: { generateDatabaseBackup: { code: 200 } } });

    (useListBackupsAdmin as jest.Mock).mockReturnValue({
      loading: false,
      backups: mockBackups,
      refetch: refetchMock,
    });

    render(<BackUpList />);
    const createButton: HTMLButtonElement = screen.getByText("Create backup") as HTMLButtonElement;
    fireEvent.click(createButton);

    const confirmButton: HTMLButtonElement = screen.getByText("confirm") as HTMLButtonElement;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(generateBackupMock).toHaveBeenCalled();
    });
  });
});
