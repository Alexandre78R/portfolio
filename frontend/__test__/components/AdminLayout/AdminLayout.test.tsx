import { render, screen, fireEvent } from '@testing-library/react'
import AdminLayout from '@/components/AdminLayout/AdminLayout'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext/UserContext'

// --- Mock Next.js navigation hooks ---
jest.mock('next/navigation', () => ({
  useRouter: jest.fn() as jest.Mock,
  usePathname: jest.fn() as jest.Mock,
}))

// --- Mock UserContext ---
jest.mock('@/context/UserContext/UserContext', () => ({
  useUser: jest.fn() as jest.Mock,
}))

// --- Mock subcomponents ---
jest.mock('@/components/AdminLayout/SideBar', () => {
  const MockSideBar: React.FC<any> = ({ navigation, sidebarOpen, setActiveTab }: any) => (
    <div
      data-testid="sidebar"
      data-navigation={JSON.stringify(navigation)}
      data-sidebar-open={sidebarOpen}
    >
      <button data-testid="call-setActiveTab" onClick={() => setActiveTab('projects')}>
        Call setActiveTab
      </button>
    </div>
  )
  MockSideBar.displayName = 'SideBar'
  return MockSideBar
})

jest.mock('@/components/AdminLayout/MobileOverlay', () => {
  const MockMobileOverlay: React.FC<any> = ({ setSidebarOpen }: any) => (
    <div data-testid="mobile-overlay" onClick={() => setSidebarOpen(false)}>
      Overlay
    </div>
  )
  MockMobileOverlay.displayName = 'MobileOverlay'
  return MockMobileOverlay
})

jest.mock('@/components/AdminLayout/ToggleButton', () => {
  const MockToggleButton: React.FC<any> = ({ sidebarOpen, setSidebarOpen }: any) => (
    <button
      data-testid="toggle-button"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      Toggle
    </button>
  )
  MockToggleButton.displayName = 'ToggleButton'
  return MockToggleButton
})

jest.mock('@/components/AdminLayout/TopbarMobile', () => {
  const MockTopbarMobile: React.FC<any> = ({ activeTab }: any) => (
    <div data-testid="topbar">{activeTab}</div>
  )
  MockTopbarMobile.displayName = 'TopbarMobile'
  return MockTopbarMobile
})

describe('AdminLayout', () => {
  const pushMock: jest.Mock = jest.fn()

  beforeEach(() => {
    pushMock.mockClear()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      prefetch: jest.fn(),
    })

    ;(usePathname as jest.Mock).mockReturnValue('/admin/dashboard')
    
    ;(useUser as jest.Mock).mockReturnValue({ user: { role: 'admin' } })
  })

  it('renders children correctly', () => {
    render(
      <AdminLayout>
        <div data-testid="child">Hello Admin</div>
      </AdminLayout>
    )
    expect(screen.getByTestId('child')).toHaveTextContent('Hello Admin')
  })

  it('renders sidebar and topbar', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('topbar')).toHaveTextContent('dashboard')
  })

  it('toggles sidebar when toggle button clicked', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const toggleBtn: HTMLElement = screen.getByTestId('toggle-button')
    fireEvent.click(toggleBtn)
    const sidebar: HTMLElement = screen.getByTestId('sidebar')
    expect(sidebar.getAttribute('data-sidebar-open')).toBe('true')
    fireEvent.click(toggleBtn)
    expect(sidebar.getAttribute('data-sidebar-open')).toBe('false')
  })

  it('shows MobileOverlay when sidebar is open', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const toggleBtn: HTMLElement = screen.getByTestId('toggle-button')
    fireEvent.click(toggleBtn)
    expect(screen.getByTestId('mobile-overlay')).toBeInTheDocument()
  })

  it('filters navigation based on role', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const sidebar: HTMLElement = screen.getByTestId('sidebar')
    const navigationProps: any[] = JSON.parse(sidebar.getAttribute('data-navigation') || '[]')
    expect(navigationProps.every((item: any) => item.disabled === false)).toBe(true)
  })

  it('calls router.push on setActiveTab', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    fireEvent.click(screen.getByTestId('call-setActiveTab'))
    expect(pushMock).toHaveBeenCalledWith('/admin/projects')
  })
})