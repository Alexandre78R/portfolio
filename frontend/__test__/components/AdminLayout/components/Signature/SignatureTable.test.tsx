import React from "react";
import { render, screen, fireEvent } from "@test-utils";
import "@testing-library/jest-dom";
import SignatureTable from "@/components/AdminLayout/components/Signature/SignatureTable";
import type { SignatureRow } from "@/components/AdminLayout/components/Signature/SignatureTable";
import type Lang from "@/lang/typeLang";

interface MockContextValue {
  translations: Lang;
}

const translationsMock: Lang = {
  messageAdminSignatureListTitle: "Signatures",
  messageAdminSignatureListNotFound: "No signatures found",
  messageAdminSignatureCreateTitle: "Create Signature",
  messageAdminSignatureInputName: "Name",
  messageAdminSignatureInputDescription: "Description",
  messageAdminSignatureButtonCreate: "Create",
  messageAdminSignatureCreateSuccess: "Created successfully",
  messageAdminSignatureCreateError: "Creation failed",
  messageAdminSignatureColumnName: "Name",
  messageAdminSignatureColumnDescription: "Description",
  messageAdminSignatureColumnAction: "Action",
  messageAdminSignatureEditTitle: "Edit Signature",
  messageAdminSignatureEditSuccess: "Updated successfully",
  messageAdminSignatureEditError: "Update failed",
  messageAdminSignatureDeleteTitle: "Delete Signature",
  messageAdminSignatureDeleteSuccess: "Deleted successfully",
  messageAdminSignatureDeleteError: "Delete failed",
  messageAdminSignatureDeleteConfirm: "Are you sure?",
} as Lang;

const mockSignatures: SignatureRow[] = [
  { id: 1, name: "Signature 1", description: "Description 1" },
  { id: 2, name: "Signature 2", description: "Description 2" },
];

jest.mock("@/context/Lang/LangContext", () => {
  return {
    useLang: jest.fn((): MockContextValue => ({
      translations: translationsMock,
    })),
  };
});

describe("SignatureTable", (): void => {
  it("should render table element", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should display table headers", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(
      screen.getByText(translationsMock.messageAdminSignatureColumnName)
    ).toBeInTheDocument();
    expect(
      screen.getByText(translationsMock.messageAdminSignatureColumnDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(translationsMock.messageAdminSignatureColumnAction)
    ).toBeInTheDocument();
  });

  it("should render all signatures in table", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByText("Signature 1")).toBeInTheDocument();
    expect(screen.getByText("Signature 2")).toBeInTheDocument();
  });

  it("should display signature descriptions in table", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("should call onEdit callback with correct signature", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const editButtons: HTMLElement[] = screen.getAllByTitle("Edit");
    fireEvent.click(editButtons[0]);

    expect(onEditMock).toHaveBeenCalledWith(mockSignatures[0]);
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete callback with correct signature ID", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButtons: HTMLElement[] = screen.getAllByTitle("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(onDeleteMock).toHaveBeenCalledWith(mockSignatures[0].id);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it("should render empty table when no signatures provided", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();
    const emptySignatures: SignatureRow[] = [];

    render(
      <SignatureTable
        signatures={emptySignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should call onEdit with correct signature for multiple rows", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const editButtons: HTMLElement[] = screen.getAllByTitle("Edit");
    fireEvent.click(editButtons[1]);

    expect(onEditMock).toHaveBeenCalledWith(mockSignatures[1]);
  });

  it("should handle multiple delete calls correctly", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButtons: HTMLElement[] = screen.getAllByTitle("Delete");
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(deleteButtons[1]);

    expect(onDeleteMock).toHaveBeenCalledTimes(2);
    expect(onDeleteMock).toHaveBeenNthCalledWith(1, 1);
    expect(onDeleteMock).toHaveBeenNthCalledWith(2, 2);
  });

  it("should render correct number of action buttons", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    render(
      <SignatureTable
        signatures={mockSignatures}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const editButtons: HTMLElement[] = screen.getAllByTitle("Edit");
    const deleteButtons: HTMLElement[] = screen.getAllByTitle("Delete");

    expect(editButtons).toHaveLength(mockSignatures.length);
    expect(deleteButtons).toHaveLength(mockSignatures.length);
  });

  it("should render HTML description properly", (): void => {
    const onEditMock: jest.Mock<void, [SignatureRow]> = jest.fn();
    const onDeleteMock: jest.Mock<void, [number]> = jest.fn();

    const signaturesWithHtml: SignatureRow[] = [
      {
        id: 1,
        name: "Test Signature",
        description: "<p>This is <strong>bold</strong> text</p>",
      },
    ];

    const { container } = render(
      <SignatureTable
        signatures={signaturesWithHtml}
        translations={translationsMock}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const strongElement: HTMLElement | null = container.querySelector("strong");
    expect(strongElement).toBeInTheDocument();
    expect(strongElement?.textContent).toBe("bold");
  });
});
