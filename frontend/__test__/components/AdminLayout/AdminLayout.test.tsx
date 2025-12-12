import React from 'react'
import { render, screen, fireEvent } from '@test-utils'
import AdminLayout from '@/components/AdminLayout/AdminLayout'
import { useRouter, usePathname } from 'next/navigation'
import { useUser, UserContextType } from '@/context/UserContext/UserContext'
import { NavItem } from '@/components/AdminLayout/Navigation'
import { Role } from '@/types/graphql'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('@/context/UserContext/UserContext', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/components/AdminLayout/SideBar', () => {
  const MockSideBar: React.FC<{
    setActiveTab: (key: string) => void
    navigation: NavItem[]
    sidebarOpen: boolean;
  }> = ({ setActiveTab, navigation, sidebarOpen }) => (
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
  MockSideBar.displayName = 'SideBar';
  return MockSideBar
})

jest.mock('@/components/AdminLayout/MobileOverlay', () => {
  const MockMobileOverlay: React.FC<{ setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    setSidebarOpen,
  }) => (
    <div data-testid="mobile-overlay" onClick={() => setSidebarOpen(false)}>
      Overlay
    </div>
  )
  MockMobileOverlay.displayName = 'MobileOverlay';
  return MockMobileOverlay;
})

jest.mock('@/components/AdminLayout/ToggleButton', () => {
  const MockToggleButton: React.FC<{ sidebarOpen: boolean; setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> =
    ({ sidebarOpen, setSidebarOpen }) => (
      <button data-testid="toggle-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle
      </button>
    )
  MockToggleButton.displayName = 'ToggleButton';
  return MockToggleButton;
})

jest.mock('@/components/AdminLayout/TopbarMobile', () => {
  const MockTopbarMobile: React.FC<{ activeTab: string }> = ({ activeTab }) => (
    <div data-testid="topbar">{activeTab}</div>
  )
  MockTopbarMobile.displayName = 'TopbarMobile';
  return MockTopbarMobile;
})

describe('AdminLayout', () => {
  const pushMock: jest.Mock = jest.fn()

  beforeEach(() => {
    pushMock.mockClear()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      prefetch: jest.fn(),
      replace: jest.fn(),
      pathname: '/admin/dashboard',
    })

    ;(usePathname as jest.Mock).mockReturnValue('/admin/dashboard')

    const mockUser: UserContextType = {
      user: {
        __typename: 'User',
        id: '1',
        firstname: 'Alexandre',
        lastname: 'Renard',
        email: 'alexandre@example.com',
        role: 'admin' as Role,
        isPasswordChange: false,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
      checkToken: jest.fn(),
    }

    ;(useUser as jest.Mock).mockReturnValue(mockUser);
  })

  it('renders children correctly', () => {
    render(
      <AdminLayout>
        <div data-testid="child">Hello Admin</div>
      </AdminLayout>
    )
    const child: HTMLElement = screen.getByTestId('child');
    expect(child).toHaveTextContent('Hello Admin');
  })

  it('renders sidebar and topbar', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const sidebar: HTMLElement = screen.getByTestId('sidebar');
    const topbar: HTMLElement = screen.getByTestId('topbar');
    expect(sidebar).toBeInTheDocument();
    expect(topbar).toHaveTextContent('dashboard');
  })

  it('toggles sidebar when toggle button clicked', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const toggleBtn: HTMLElement = screen.getByTestId('toggle-button');
    fireEvent.click(toggleBtn);

    const sidebar: HTMLElement = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-sidebar-open')).toBe('true');

    fireEvent.click(toggleBtn);
    expect(sidebar.getAttribute('data-sidebar-open')).toBe('false');
  })

  it('shows MobileOverlay when sidebar is open', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const toggleBtn: HTMLElement = screen.getByTestId('toggle-button');
    fireEvent.click(toggleBtn);

    const overlay: HTMLElement = screen.getByTestId('mobile-overlay');
    expect(overlay).toBeInTheDocument();
  })

  it('filters navigation based on role', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const sidebar: HTMLElement = screen.getByTestId('sidebar')
    const navigationProps: NavItem[] = JSON.parse(sidebar.getAttribute('data-navigation') || '[]')
    expect(navigationProps.every(item => item.disabled === false)).toBe(true)
  })

  it('calls router.push on setActiveTab', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    const setActiveTabBtn: HTMLElement = screen.getByTestId('call-setActiveTab')
    fireEvent.click(setActiveTabBtn)
    expect(pushMock).toHaveBeenCalledWith('/admin/projects')
  })
})
