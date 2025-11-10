import React, { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackupActions from "@/components/AdminLayout/components/Backup/BackupActions";
import { BackupFileInfo } from "@/components/AdminLayout/Pages/BackUp/BackUpList";

jest.mock("@/components/AdminLayout/components/Button/ActionButton", () => {
  return ({
    row,
    actions,
  }: {
    row: BackupFileInfo;
    actions: Array<{
      label: string;
      onClick: () => void;
    }>;
  }): ReactElement => (
    <div>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          data-testid={`action-${action.label}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
});

const creerSauvegardeFictive = (): BackupFileInfo => {
  const sauvegardeFictive: BackupFileInfo = {
    fileName: "sauvegarde-test.sql",
    sizeBytes: 4096,
    createdAt: "2024-01-01T10:00:00.000Z",
    modifiedAt: "2024-01-01T12:00:00.000Z",
  };

  return sauvegardeFictive;
};

const creerFonctionSuppressionMockee = (): jest.Mock<
  void,
  [string]
> => {
  const fonctionSuppressionMockee: jest.Mock<void, [string]> =
    jest.fn<void, [string]>();

  return fonctionSuppressionMockee;
};

const mockerOuvertureFenetre = (): jest.SpyInstance<Window | null> => {
  const espionOuverture: jest.SpyInstance<Window | null> = jest
    .spyOn(window, "open")
    .mockImplementation((): Window | null => null);

  return espionOuverture;
};

describe("BackupActions component", () => {
  test("should open a new tab when clicking on View action", () => {
    const ligneSauvegarde: BackupFileInfo = creerSauvegardeFictive();
    const fonctionSuppression: jest.Mock<
      void,
      [string]
    > = creerFonctionSuppressionMockee();

    const espionOuverture: jest.SpyInstance<
      Window | null,
      [string, string]
    > = mockerOuvertureFenetre();

    render(
      <BackupActions
        row={ligneSauvegarde}
        onDelete={fonctionSuppression}
      />
    );

    const boutonVoir: HTMLElement =
      screen.getByTestId("action-View");

    fireEvent.click(boutonVoir);

    expect(espionOuverture).toHaveBeenCalledTimes(1);
    expect(espionOuverture).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/backups/sauvegarde-test.sql`,
      "_blank"
    );

    espionOuverture.mockRestore();
  });

  test("should open a new tab when clicking on Download action", () => {
    const ligneSauvegarde: BackupFileInfo = creerSauvegardeFictive();
    const fonctionSuppression: jest.Mock<
      void,
      [string]
    > = creerFonctionSuppressionMockee();

    const espionOuverture: jest.SpyInstance<
      Window | null,
      [string, string]
    > = mockerOuvertureFenetre();

    render(
      <BackupActions
        row={ligneSauvegarde}
        onDelete={fonctionSuppression}
      />
    );

    const boutonTelechargement: HTMLElement =
      screen.getByTestId("action-Download");

    fireEvent.click(boutonTelechargement);

    expect(espionOuverture).toHaveBeenCalledTimes(1);
    expect(espionOuverture).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/backups/sauvegarde-test.sql/download`,
      "_blank"
    );

    espionOuverture.mockRestore();
  });

  test("should call delete callback with correct file name when clicking on Delete action", () => {
    const ligneSauvegarde: BackupFileInfo = creerSauvegardeFictive();
    const fonctionSuppression: jest.Mock<
      void,
      [string]
    > = creerFonctionSuppressionMockee();

    render(
      <BackupActions
        row={ligneSauvegarde}
        onDelete={fonctionSuppression}
      />
    );

    const boutonSuppression: HTMLElement =
      screen.getByTestId("action-Delete");

    fireEvent.click(boutonSuppression);

    expect(fonctionSuppression).toHaveBeenCalledTimes(1);
    expect(fonctionSuppression).toHaveBeenCalledWith(
      "sauvegarde-test.sql"
    );
  });
});
