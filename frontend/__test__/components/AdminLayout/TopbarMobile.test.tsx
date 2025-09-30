import { render, screen } from '@testing-library/react'
import TopbarMobile from '@/components/AdminLayout/TopbarMobile'

describe('TopbarMobile', () => {
  const navigationMock: Array<{ name: string; key: string }> = [
    { name: 'Dashboard' as string, key: 'dashboard' as string },
    { name: 'Projects' as string, key: 'projects' as string },
    { name: 'Users' as string, key: 'users' as string },
  ]

  it('renders correctly', () => {
    render(<TopbarMobile activeTab="dashboard" navigation={navigationMock} />)
    const container: HTMLElement = screen.getByText('Dashboard')
    expect(container).toBeInTheDocument()
  })

  it('displays the correct name based on activeTab', () => {
    render(<TopbarMobile activeTab="projects" navigation={navigationMock} />)
    const span: HTMLElement = screen.getByText('Projects')
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass('font-semibold text-lg capitaliz text-primary')
  })

  it('renders nothing if activeTab does not match any navigation item', () => {
    render(<TopbarMobile activeTab="nonexistent" navigation={navigationMock} />)
    const span: HTMLElement | null = screen.queryByText(/./)
    expect(span).toBeNull()
  })
})