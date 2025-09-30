import { render, screen, fireEvent } from '@testing-library/react'
import ToggleButton from '@/components/AdminLayout/ToggleButton'

describe('ToggleButton', () => {
  const setSidebarOpen: jest.Mock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when sidebar is closed', () => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)
    const btn: HTMLElement = screen.getByRole('button', { name: /open sidebar/i })
    expect(btn).toBeInTheDocument()
    expect(btn).not.toHaveClass('hidden')
  })

  it('renders hidden when sidebar is open', () => {
    render(<ToggleButton sidebarOpen={true} setSidebarOpen={setSidebarOpen} />)
    const btn: HTMLElement = screen.getByRole('button', { name: /open sidebar/i })
    expect(btn).toHaveClass('hidden')
  })

  it('calls setSidebarOpen(true) when clicked', () => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)
    const btn: HTMLElement = screen.getByRole('button', { name: /open sidebar/i })
    fireEvent.click(btn)
    expect(setSidebarOpen).toHaveBeenCalledTimes(1)
    expect(setSidebarOpen).toHaveBeenCalledWith(true)
  })

  it('renders the Menu icon', () => {
    const { container }: { container: HTMLElement } = render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)
    const icon: SVGSVGElement | null = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})