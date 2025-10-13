import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MobileOverlay, { MobileOverlayProps } from '@/components/AdminLayout/MobileOverlay'

describe('MobileOverlay', () => {
  it('renders correctly', () => {
    const mockSetSidebarOpen: MobileOverlayProps['setSidebarOpen'] = jest.fn()

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
    const mockSetSidebarOpen: MobileOverlayProps['setSidebarOpen'] = jest.fn()

    render(<MobileOverlay setSidebarOpen={mockSetSidebarOpen} />)

    const overlay: HTMLElement = screen.getByTestId('overlay')
    fireEvent.click(overlay)

    expect(mockSetSidebarOpen).toHaveBeenCalledTimes(1)
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false)
  })
})