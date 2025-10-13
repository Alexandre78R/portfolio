import { render, screen, fireEvent } from '@testing-library/react'
import ToggleButton from '@/components/AdminLayout/ToggleButton'
import { Dispatch, SetStateAction } from 'react'

describe('ToggleButton', () => {
  let setSidebarOpen: jest.MockedFunction<Dispatch<SetStateAction<boolean>>>

  beforeEach((): void => {
    setSidebarOpen = jest.fn()
  })

  it('renders correctly when sidebar is closed', (): void => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)

    const button: HTMLButtonElement = screen.getByRole('button', {
      name: /open sidebar/i,
    })

    expect(button).toBeInTheDocument()
    expect(button).not.toHaveClass('hidden')
  })

  it('renders hidden when sidebar is open', (): void => {
    render(<ToggleButton sidebarOpen setSidebarOpen={setSidebarOpen} />)

    const button: HTMLButtonElement = screen.getByRole('button', {
      name: /open sidebar/i,
    })

    expect(button).toHaveClass('hidden')
  })

  it('calls setSidebarOpen(true) when clicked', (): void => {
    render(<ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />)

    const button: HTMLButtonElement = screen.getByRole('button', {
      name: /open sidebar/i,
    })

    fireEvent.click(button)

    expect(setSidebarOpen).toHaveBeenCalledTimes(1)
    expect(setSidebarOpen).toHaveBeenCalledWith(true)
  })

  it('renders the Menu icon', (): void => {
    const { container }: { container: HTMLElement } = render(
      <ToggleButton sidebarOpen={false} setSidebarOpen={setSidebarOpen} />
    )

    const icon: SVGSVGElement | null = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})