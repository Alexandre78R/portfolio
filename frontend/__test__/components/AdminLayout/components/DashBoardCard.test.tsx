import { render, screen } from '@testing-library/react'
import DashboardCard from '@/components/AdminLayout/components/Dashboard/DashBordCard'
import { FaBeer } from 'react-icons/fa'

describe('DashboardCard', () => {
  it('renders title and value correctly', () => {
    render(<DashboardCard title="Test Title" value={42} /> as React.ReactElement)

    expect(screen.getByText('Test Title' as string) as HTMLElement).toBeInTheDocument()
    expect(screen.getByText('42' as string) as HTMLElement).toBeInTheDocument()
  })

  it('renders icon if provided', () => {
    render(<DashboardCard title="Icon Test" value={100} icon={<FaBeer data-testid="icon" />} /> as React.ReactElement)

    expect(screen.getByTestId('icon' as string) as HTMLElement).toBeInTheDocument()
  })

  it('uses default color if no color is provided', () => {
    render(<DashboardCard title="Color Test" value={1} /> as React.ReactElement)

    const rootDiv: HTMLElement | null = screen.getByText('1').closest('div')?.parentElement?.firstChild as HTMLElement
    expect(rootDiv as HTMLElement).toHaveClass('bg-gradient-to-tr from-blue-500 to-blue-400' as string)
  })

  it('applies custom color if provided', () => {
    render(<DashboardCard title="Custom Color" value={10} color="from-red-500 to-red-400" /> as React.ReactElement)

    const rootDiv: HTMLElement | null = screen.getByText('10').closest('div')?.parentElement?.firstChild as HTMLElement
    expect(rootDiv as HTMLElement).toHaveClass('bg-gradient-to-tr from-red-500 to-red-400' as string)
  })

  it('contains main container classes', () => {
    const { container }: { container: HTMLElement } = render(<DashboardCard title="Class Test" value={5} />)

    const rootDiv: HTMLElement | null = container.firstChild as HTMLElement
    expect(rootDiv as HTMLElement).toHaveClass(
      'flex flex-col items-start gap-3 rounded-2xl p-6 shadow-md' as string
    )
  })
})