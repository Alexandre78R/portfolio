import { render, screen, fireEvent } from '@testing-library/react'
import MobileOverlay from '@/components/AdminLayout/MobileOverlay'

describe('MobileOverlay', () => {
  it('renders correctly', () => {
    const mockSetSidebarOpen: jest.Mock = jest.fn()
    render(<MobileOverlay setSidebarOpen={mockSetSidebarOpen} />)

    const overlay: HTMLElement = screen.getByTestId('overlay')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass(
      'fixed',
      'top-[80px]',
      'left-0',
      'right-0',
      'bottom-0',
      'z-30',
      'bg-black',
      'bg-opacity-40',
      'md:hidden'
    )
  })

  it('calls setSidebarOpen(false) when clicked', () => {
    const mockSetSidebarOpen: jest.Mock = jest.fn()
    render(<MobileOverlay setSidebarOpen={mockSetSidebarOpen} />)

    const overlay: HTMLElement = screen.getByTestId('overlay')
    fireEvent.click(overlay as HTMLElement)

    expect(mockSetSidebarOpen as jest.Mock).toHaveBeenCalledTimes(1)
    expect(mockSetSidebarOpen as jest.Mock).toHaveBeenCalledWith(false)
  })
})