import { render, screen } from '@testing-library/react'
import TopbarMobile from '@/components/AdminLayout/TopbarMobile'

describe('TopbarMobile', () => {
  const navigationMock: Array<{ name: string; key: string }> = [
    { name: 'Dashboard' as string, key: 'dashboard' as string },
    { name: 'Projects' as string, key: 'projects' as string },
    { name: 'Users' as string, key: 'users' as string },
  ]

  it('renders correctly', () => {
    render(<TopbarMobile activeTab="dashboard" navigation={navigationMock} /> as React.ReactElement)
    const container: HTMLElement = screen.getByText('Dashboard' as string)
    expect(container as HTMLElement).toBeInTheDocument()
  })

  it('displays the correct name based on activeTab', () => {
    render(<TopbarMobile activeTab="projects" navigation={navigationMock} /> as React.ReactElement)
    const span: HTMLElement = screen.getByText('Projects' as string)
    expect(span as HTMLElement).toBeInTheDocument()
    expect(span as HTMLElement).toHaveClass('font-semibold text-lg capitaliz text-primary')
  })

  it('renders nothing if activeTab does not match any navigation item', () => {
    render(<TopbarMobile activeTab="nonexistent" navigation={navigationMock} /> as React.ReactElement)
    const span: HTMLElement | null = screen.queryByText(/./)
    expect(span as HTMLElement | null).toBeNull()
  })
})