import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '@/components/AdminLayout/components/ConfirmDialog/ConfirmDialog'

// --- Mock des composants enfants ---
jest.mock('@/components/ModalCustom/ModalCustom', () => {
  const ModalCustom: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose, children }: any) => {
    return (
      <div data-testid="modal" data-open={open}>
        {children}
      </div>
    )
  }
  ModalCustom.displayName = 'ModalCustom' as string
  return ModalCustom as React.FC<{ open: boolean; onClose: () => void }>
})

jest.mock('@/components/Button/Button', () => {
  const Button: React.FC<{ text: string; onClick: () => void; disable?: boolean; disabled?: boolean }> = ({ text, onClick, disable, disabled }) => (
    <button
      data-testid={`button-${text}`}
      disabled={disable || disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {text}
    </button>
  )
  Button.displayName = 'Button' as string
  return Button as React.FC<{ text: string; onClick: () => void; disable?: boolean; disabled?: boolean }>
})

describe('ConfirmDialog', () => {
  const onConfirmMock: jest.Mock = jest.fn()
  const onCancelMock: jest.Mock = jest.fn()

  beforeEach(() => {
    onConfirmMock.mockClear()
    onCancelMock.mockClear()
  })

  it('renders modal with title and description', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Supprimer l’élément"
        description="Êtes-vous sûr ?"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    )

    expect(screen.getByTestId('modal' as string)as HTMLElement).toBeInTheDocument()
    expect(screen.getByText('Supprimer l’élément' as string) as HTMLElement).toBeInTheDocument()
    expect(screen.getByText('Êtes-vous sûr ?' as string) as HTMLElement).toBeInTheDocument()
  })

  it('renders default title if none is provided', () => {
    render(
      <ConfirmDialog
        open={true}
        description="Test description"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    )

    expect(screen.getByText('Confirmation' as string) as HTMLElement).toBeInTheDocument()
    expect(screen.getByText('Test description' as string) as HTMLElement).toBeInTheDocument()
  })

  it('renders custom button labels', () => {
    render(
      <ConfirmDialog
        open={true}
        description="Test"
        confirmLabel="Oui"
        cancelLabel="Non"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    )

    expect(screen.getByTestId('button-Oui')).toBeInTheDocument()
    expect(screen.getByTestId('button-Non')).toBeInTheDocument()
  })

  it('calls onConfirm and onCancel when buttons are clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    )

    fireEvent.click(screen.getByTestId('button-Annuler' as string) as HTMLElement)
    fireEvent.click(screen.getByTestId('button-Confirmer' as string) as HTMLElement)

    expect(onCancelMock as jest.Mock).toHaveBeenCalledTimes(1 as number)
    expect(onConfirmMock as jest.Mock).toHaveBeenCalledTimes(1 as number)
  })

  it('disables buttons when disabled props are true', () => {
    render(
        <ConfirmDialog
        open={true}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        cancelDisabled={true}
        /> as React.ReactElement
    )

    expect(screen.getByTestId('button-Annuler' as string) as HTMLElement).toBeDisabled()
  })

  it('passes open prop to ModalCustom', () => {
    render(
      <ConfirmDialog
        open={false}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      /> as React.ReactElement
    )

    expect(screen.getByTestId('modal' as string).getAttribute('data-open' as string) as string).toBe('false' as string)
  })
})