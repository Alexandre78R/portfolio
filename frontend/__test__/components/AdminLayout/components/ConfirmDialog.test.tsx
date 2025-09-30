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
  return ModalCustom
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
  return Button
})

describe('ConfirmDialog', () => {
  const onConfirmMock: jest.Mock = jest.fn()
  const onCancelMock = jest.fn()

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
      />
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Supprimer l’élément')).toBeInTheDocument()
    expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument()
  })

  it('renders default title if none is provided', () => {
    render(
      <ConfirmDialog
        open={true}
        description="Test description"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    )

    expect(screen.getByText('Confirmation')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
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
      />
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
      />
    )

    fireEvent.click(screen.getByTestId('button-Annuler'))
    fireEvent.click(screen.getByTestId('button-Confirmer'))

    expect(onCancelMock).toHaveBeenCalledTimes(1)
    expect(onConfirmMock).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when disabled props are true', () => {
    render(
        <ConfirmDialog
        open={true}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        cancelDisabled={true}
        />
    )

    expect(screen.getByTestId('button-Annuler')).toBeDisabled()
  })

  it('passes open prop to ModalCustom', () => {
    render(
      <ConfirmDialog
        open={false}
        description="Test"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    )

    expect(screen.getByTestId('modal').getAttribute('data-open')).toBe('false')
  })
})