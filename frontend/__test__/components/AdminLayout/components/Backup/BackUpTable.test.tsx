import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import "@testing-library/jest-dom";
import BackUpTable, { formatBytes, formatDate } from "@/components/AdminLayout/components/Backup/BackUpTable";
import { BackupFileInfo } from "@/types/graphql";
import Lang from "@/lang/typeLang";
import BackupActions from "@/components/AdminLayout/components/Backup/BackupActions";

jest.mock("@/components/AdminLayout/components/Backup/BackupActions", () => ({
  __esModule: true,
  default: ({
    row,
    onDelete,
  }: {
    row: BackupFileInfo;
    onDelete: (fileName: string) => void;
  }): React.ReactElement => (
    <button
      onClick={(): void => onDelete(row.fileName)}
      data-testid={`delete-${row.fileName}`}
    >
      Delete {row.fileName}
    </button>
  ),
}));

const translations: Lang = {
  messagePageBackUpListFileName: "File Name",
  messagePageBackUpListSize: "Size",
  messagePageBackUpListDateCreated: "Date Created",
  messagePageBackUpListDateModified: "Date Modified",
  messagePageBackUpListAction: "Actions",
} as Lang;

const backups: BackupFileInfo[] = [
  {
    fileName: "backup1.zip",
    sizeBytes: 1024,
    createdAt: "2026-01-25T10:00:00.000Z",
    modifiedAt: "2026-01-25T11:00:00.000Z",
  },
  {
    fileName: "backup2.zip",
    sizeBytes: 1048576,
    createdAt: "2026-01-24T09:30:00.000Z",
    modifiedAt: "2026-01-24T12:15:00.000Z",
  },
];

describe("BackUpTable Component", (): void => {
  let mockOnDelete: jest.Mock<void, [string]>;
  
  const originalTZ: string | undefined = process.env.TZ;
  
  beforeAll(() => {
    process.env.TZ = 'Europe/Paris';
  });
  
  afterAll(() => {
    process.env.TZ = originalTZ;
  });

  beforeEach((): void => {
    mockOnDelete = jest.fn<void, [string]>();
  });

  it("renders table headers correctly", (): void => {
    render(<BackUpTable backups={backups} translations={translations} onDelete={mockOnDelete} />);

    expect(screen.getByText(translations.messagePageBackUpListFileName)).toBeInTheDocument();
    expect(screen.getByText(translations.messagePageBackUpListSize)).toBeInTheDocument();
    expect(screen.getByText(translations.messagePageBackUpListDateCreated)).toBeInTheDocument();
    expect(screen.getByText(translations.messagePageBackUpListDateModified)).toBeInTheDocument();
    expect(screen.getByText(translations.messagePageBackUpListAction)).toBeInTheDocument();
  });

  it("renders backup data with formatted bytes and dates", (): void => {
    render(<BackUpTable backups={backups} translations={translations} onDelete={mockOnDelete} />);

    expect(screen.getByText("1.00 KB")).toBeInTheDocument();
    expect(screen.getByText("1.00 MB")).toBeInTheDocument();

    expect(screen.getByText("25/01/2026 11:00")).toBeInTheDocument(); // 10:00 UTC = 11:00 CET
    expect(screen.getByText("25/01/2026 12:00")).toBeInTheDocument(); // 11:00 UTC = 12:00 CET
    expect(screen.getByText("24/01/2026 10:30")).toBeInTheDocument(); // 09:30 UTC = 10:30 CET
    expect(screen.getByText("24/01/2026 13:15")).toBeInTheDocument(); // 12:15 UTC = 13:15 CET
  });

  it("calls onDelete when BackupActions button is clicked", (): void => {
    render(<BackUpTable backups={backups} translations={translations} onDelete={mockOnDelete} />);

    const deleteButton: HTMLElement = screen.getByTestId("delete-backup1.zip");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith("backup1.zip");
  });

  it("formats bytes correctly", (): void => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(500)).toBe("500.00 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1048576)).toBe("1.00 MB");
    expect(formatBytes(1073741824)).toBe("1.00 GB");
  });

  it("formats dates correctly", (): void => {
    // With Europe/Paris timezone (UTC+1)
    const dateStr: string = formatDate("2026-01-25T10:00:00.000Z");
    expect(dateStr).toContain("25/01/2026");
    expect(dateStr).toContain("11:00"); // 10:00 UTC = 11:00 CET

    const dateStr2: string = formatDate("2026-12-31T23:59:00.000Z");
    expect(dateStr2).toContain("01/01/2027"); // 23:59 UTC on Dec 31 = 00:59 CET on Jan 1
    expect(dateStr2).toContain("00:59");
  });

  it("renders empty state correctly when no backups are provided", (): void => {
    render(<BackUpTable backups={[]} translations={translations} onDelete={mockOnDelete} />);
    const deleteButton: HTMLElement | null = screen.queryByTestId("delete-backup1.zip");
    expect(deleteButton).toBeNull();
  });
});
