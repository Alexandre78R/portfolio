import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BackUpList from "../../../../src/components/AdminLayout/Pages/BackUp/BackUpList";

const refetchMock: jest.Mock = jest.fn();
const generateBackupMock: jest.Mock = jest.fn();
const deleteBackupMock: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => ({
  useGetBackupsListQuery: jest.fn(),
  useGenerateDatabaseBackupMutation: () => [generateBackupMock],
  useDeleteBackupFileMutation: () => [deleteBackupMock],
}));


jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({
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
    },
  }),
}));


jest.mock("@/components/Loading/LoadingCustom", () => {
  const LoadingMock: React.FC = () => <div data-testid="loading">Loading...</div>;
  LoadingMock.displayName = "LoadingCustom" as string;
  return LoadingMock;
});

jest.mock("../../../../src/components/AdminLayout/components/Table/Table", () => {
  const TableMock: React.FC = (props: any) => (
    <div data-testid="table">
      {props.data.map((row: any) => (
        <div key={row.fileName}>{row.fileName}</div>
      ))}
    </div>
  );
  TableMock.displayName = "Table";
  return TableMock;
});

jest.mock("../../../../src/components/AdminLayout/components/ConfirmDialog/ConfirmDialog", () => {
  const ConfirmDialogMock: React.FC = (props: any) =>
    props.open ? (
      <div data-testid="confirm-dialog">
        <button onClick={props.onConfirm}>confirm</button>
        <button onClick={props.onCancel}>cancel</button>
      </div>
    ) : null;
  ConfirmDialogMock.displayName = "ConfirmDialog";
  return ConfirmDialogMock;
});

jest.mock("@/components/ToastCustom/CustomToast", () => () => ({
  showAlert: jest.fn() as jest.Mock,
}));

jest.mock("../../../../src/components/Button/Button", () => {
  const ButtonMock: React.FC = (props: any) => <button onClick={props.onClick}>{props.text}</button>;
  ButtonMock.displayName = "Button" as string;
  return ButtonMock;
});

jest.mock("../../../../src/components/AdminLayout/components/Text/TextAdmin", () => {
  const TextAdminMock: React.FC = (props: any) => <div>{props.children}</div>;
  TextAdminMock.displayName = "TextAdmin" as string;
  return TextAdminMock;
});

describe("BackUpList Page", () => {
  const mockBackups: ReadonlyArray<{
    fileName: string;
    sizeBytes: number;
    createdAt: string;
    modifiedAt: string;
  }> = [
    {
      fileName: "backup-1.sql" as const,
      sizeBytes: 1024 as const,
      createdAt: "2024-01-01T10:00:00Z" as const,
      modifiedAt: "2024-01-01T10:00:00Z" as const,
    } as const,
  ] as const;

  beforeEach(() => {
    jest.clearAllMocks() as unknown;
  });

  it("renders loading state", () => {
    const { useGetBackupsListQuery } = require("@/types/graphql");
    useGetBackupsListQuery.mockReturnValue({ loading: true } as const);

    render(<BackUpList /> as React.ReactElement);
    expect(screen.getByTestId("loading" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders error state", () => {
    const { useGetBackupsListQuery } = require("@/types/graphql");
    useGetBackupsListQuery.mockReturnValue({
      loading: false as boolean,
      error: true as boolean,
    });

    render(<BackUpList /> as React.ReactElement);
    expect(screen.getByText("No backups" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders backups list", () => {
    const { useGetBackupsListQuery } = require("@/types/graphql");
    useGetBackupsListQuery.mockReturnValue({
      loading: false as boolean,
      error: false as boolean,
      data: { listBackupFiles: { files: mockBackups } as { files: typeof mockBackups } } as const,
      refetch: refetchMock as jest.Mock,
    });

    render(<BackUpList /> as React.ReactElement);
    expect(screen.getByText("backup-1.sql" as string) as HTMLElement).toBeInTheDocument();
  });

  it("opens confirm dialog when clicking create backup", () => {
    const { useGetBackupsListQuery } = require("@/types/graphql");
    useGetBackupsListQuery.mockReturnValue({
      loading: false as boolean,
      error: false as boolean,
      data: { listBackupFiles: { files: mockBackups } } as const,
      refetch: refetchMock as jest.Mock,
    });

    render(<BackUpList />);
    fireEvent.click(screen.getByText("Create backup" as string) as HTMLElement);
    expect(screen.getByTestId("confirm-dialog" as string) as HTMLElement).toBeInTheDocument();
  });

  it("calls generate backup mutation on confirm", async () => {
    generateBackupMock.mockResolvedValue({
      data: { generateDatabaseBackup: { code: 200 } } as const,
    });

    const { useGetBackupsListQuery } = require("@/types/graphql");
    useGetBackupsListQuery.mockReturnValue({
      loading: false as boolean,
      error: false as boolean,
      data: { listBackupFiles: { files: mockBackups } } as const,
      refetch: refetchMock as jest.Mock,
    });

    render(<BackUpList />);
    fireEvent.click(screen.getByText("Create backup" as string) as HTMLElement);
    fireEvent.click(screen.getByText("confirm" as string) as HTMLElement);

    await waitFor(() => {
      expect(generateBackupMock).toHaveBeenCalled();
    });
  });
});