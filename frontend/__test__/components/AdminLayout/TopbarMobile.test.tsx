import { render, screen } from '@test-utils'
import TopbarMobile, { type NavItem } from '@/components/AdminLayout/TopbarMobile'

describe('TopbarMobile', () => {
  const navigationMock: NavItem[] = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Projects', key: 'projects' },
    { name: 'Users', key: 'users' },
  ]

  it('renders correctly', (): void => {
    render(<TopbarMobile activeTab="dashboard" navigation={navigationMock} />)

    const span: HTMLSpanElement = screen.getByText('Dashboard')
    expect(span).toBeInTheDocument()
  })

  it('displays the correct name based on activeTab', (): void => {
    render(<TopbarMobile activeTab="projects" navigation={navigationMock} />);

    const span: HTMLSpanElement = screen.getByText('Projects');
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass(
      'font-semibold',
      'text-lg',
      'capitaliz',
      'text-primary'
    )
  });

  it('renders empty span when activeTab does not match any navigation item', (): void => {
    render(<TopbarMobile activeTab="nonexistent" navigation={navigationMock} />);

    const span: HTMLSpanElement | null = screen.getByText('', { selector: 'span' });
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('');
  })
})
