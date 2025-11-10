import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackupActions from "@/components/Backup/BackupActions";
import type { BackupFileInfo } from "@/components/AdminLayout/Pages/BackUp/BackUpList";

jest.mock(
  "@/components/AdminLayout/components/Button/ActionButton",
  () => ({
    __esModule: true,
    default: ({
      actions,
    }: {
      actions: {
        label: string;
        onClick: () => void;
      }[];
    }): React.ReactElement => (
      <div>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            data-testid={`action-${action.label}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    ),
  })
);

jest.mock("lucide-react", () => ({
  Eye: () => <span data-testid="icon-eye" />,
  Download: () => <span data-testid="icon-download" />,
  Trash: () => <span data-testid="icon-trash" />,
}));

const creerBackupFictif = (): BackupFileInfo => ({
  fileName: "backup-test.sql",
  sizeBytes: 1024,
  createdAt: "2024-01-01T10:00:00.000Z",
  modifiedAt: "2024-01-01T12:00:00.000Z",
});

const creerProps = () => {
  const fonctionOnDelete = jest.fn();
  return {
    ligne: creerBackupFictif(),
    fonctionOnDelete,
  };
};

describe("BackupActions component", () => {
  const ancienneWindowOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.open = ancienneWindowOpen;
  });

  test("should render all action buttons", () => {
    const { ligne, fonctionOnDelete } = creerProps();

    render(
      <BackupActions row={ligne} onDelete={fonctionOnDelete} />
    );

    expect(screen.getByTestId("action-View")).toBeInTheDocument();
    expect(screen.getByTestId("action-Download")).toBeInTheDocument();
    expect(screen.getByTestId("action-Delete")).toBeInTheDocument();
  });

  test("should open the backup file in a new tab when clicking View", () => {
    const { ligne, fonctionOnDelete } = creerProps();

    render(
      <BackupActions row={ligne} onDelete={fonctionOnDelete} />
    );

    fireEvent.click(screen.getByTestId("action-View"));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/backups/${ligne.fileName}`,
      "_blank"
    );
  });

  test("should download the backup file when clicking Download", () => {
    const { ligne, fonctionOnDelete } = creerProps();

    render(
      <BackupActions row={ligne} onDelete={fonctionOnDelete} />
    );

    fireEvent.click(screen.getByTestId("action-Download"));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/backups/${ligne.fileName}/download`,
      "_blank"
    );
  });

  test("should call onDelete with the correct file name when clicking Delete", () => {
    const { ligne, fonctionOnDelete } = creerProps();

    render(
      <BackupActions row={ligne} onDelete={fonctionOnDelete} />
    );

    fireEvent.click(screen.getByTestId("action-Delete"));

    expect(fonctionOnDelete).toHaveBeenCalledTimes(1);
    expect(fonctionOnDelete).toHaveBeenCalledWith(ligne.fileName);
  });
});