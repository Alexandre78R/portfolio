import React from "react";
import { render, screen, fireEvent } from '@test-utils';
import ConfirmDialog, { type ConfirmDialogProps } from '@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog';

jest.mock('@/components/ModalCustom/ModalCustom', () => {
  const ModalCustom: React.FC<{ open: boolean; onClose: () => void; children?: React.ReactNode }> = ({
    open,
    onClose,
    children,
  }) => (
    <div data-testid="modal" data-open={open}>
      {children}
    </div>
  );
  ModalCustom.displayName = 'ModalCustom';
  return ModalCustom;
});

jest.mock('@/components/Button/Button', () => {
  const ButtonCustom: React.FC<{
    text: string;
    onClick: () => void;
    disable?: boolean;
  }> = ({ text, onClick, disable }) => (
    <button
      data-testid={`button-${text}`}
      disabled={disable}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {text}
    </button>
  );
  ButtonCustom.displayName = 'ButtonCustom';
  return ButtonCustom;
});

describe('ConfirmDialog', (): void => {
  const onConfirmMock: jest.Mock<void, []> = jest.fn();
  const onCancelMock: jest.Mock<void, []> = jest.fn();

  beforeEach((): void => {
    onConfirmMock.mockClear();
    onCancelMock.mockClear();
  });

  it('renders modal with title and description', (): void => {
    render(
      <ConfirmDialog
        open={true}
        title="Supprimer l’élément"
        description="Êtes-vous sûr ?"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    );

    const modalElement: HTMLElement = screen.getByTestId('modal');
    const titleElement: HTMLElement = screen.getByText('Supprimer l’élément');
    const descriptionElement: HTMLElement = screen.getByText('Êtes-vous sûr ?');

    expect(modalElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders default title if none is provided', (): void => {
    render(
      <ConfirmDialog
        open={true}
        description="Test description"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    );

    const titleElement: HTMLElement = screen.getByText('Confirmation');
    const descriptionElement: HTMLElement = screen.getByText('Test description');

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders custom button labels', (): void => {
    render(
      <ConfirmDialog
        open={true}
        description="Test"
        confirmLabel="Oui"
        cancelLabel="Non"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    );

    const confirmButton: HTMLButtonElement = screen.getByTestId('button-Oui') as HTMLButtonElement;
    const cancelButton: HTMLButtonElement = screen.getByTestId('button-Non') as HTMLButtonElement;

    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel when buttons are clicked', (): void => {
    render(
      <ConfirmDialog
        open={true}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    );

    const cancelButton: HTMLButtonElement = screen.getByTestId('button-Annuler') as HTMLButtonElement;
    const confirmButton: HTMLButtonElement = screen.getByTestId('button-Confirmer') as HTMLButtonElement;

    fireEvent.click(cancelButton);
    fireEvent.click(confirmButton);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when disable props are true', (): void => {
    render(
      <ConfirmDialog
        open={true}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        cancelDisabled={true}
        confirmDisabled={true}
      /> as React.ReactElement
    );

    const cancelButton: HTMLButtonElement = screen.getByTestId('button-Annuler') as HTMLButtonElement;
    const confirmButton: HTMLButtonElement = screen.getByTestId('button-Confirmer') as HTMLButtonElement;

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('passes open prop to ModalCustom', (): void => {
    render(
      <ConfirmDialog
        open={false}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    );

    const modalElement: HTMLElement = screen.getByTestId('modal');
    expect(modalElement.getAttribute('data-open')).toBe('false');
  });
});
