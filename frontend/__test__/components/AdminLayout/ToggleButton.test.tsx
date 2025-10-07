import { render, screen, fireEvent } from '@testing-library/react'
import ToggleButton from '@/components/AdminLayout/ToggleButton'
import React from 'react'

describe('ToggleButton', () => {
  const setSidebarOpen: jest.Mock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when sidebar is closed', () => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} /> as React.ReactElement)
    const btn: HTMLElement = screen.getByRole('button' as string, { name: /open sidebar/i })
    expect(btn).toBeInTheDocument()
    expect(btn).not.toHaveClass('hidden' as string)
  })

  it('renders hidden when sidebar is open', () => {
    render(<ToggleButton sidebarOpen={true} setSidebarOpen={setSidebarOpen} /> as React.ReactElement)
    const btn: HTMLElement = screen.getByRole('button' as string, { name: /open sidebar/i })
    expect(btn).toHaveClass('hidden' as string)
  })

  it('calls setSidebarOpen(true) when clicked', () => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} /> as React.ReactElement)
    const btn: HTMLElement = screen.getByRole('button' as string, { name: /open sidebar/i })
    fireEvent.click(btn as HTMLElement)
    expect(setSidebarOpen as jest.Mock).toHaveBeenCalledTimes(1 as number)
    expect(setSidebarOpen as jest.Mock).toHaveBeenCalledWith(true as boolean)
  })

  it('renders the Menu icon', () => {
    const { container }: { container: HTMLElement } = render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)
    const icon: SVGSVGElement | null = container.querySelector('svg' as string)
    expect(icon as SVGSVGElement).toBeInTheDocument()
  })
})