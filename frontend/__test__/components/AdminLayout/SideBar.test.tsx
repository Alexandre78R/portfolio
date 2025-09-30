import { render, screen, fireEvent } from '@testing-library/react'
import SideBar from '@/components/AdminLayout/SideBar'
import { NavItem } from '@/components/AdminLayout/Navigation'
import { HtmlContext } from 'next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints'

// Mock le contexte Lang
jest.mock('@/context/Lang/LangContext', () => ({
  useLang: () => ({
    translations: {} as Record<string, string>,
  }),
}))

// Mock icônes simples
const MockIcon: React.FC = () => <span data-testid="icon" />

describe('SideBar', () => {
  const setSidebarOpen: jest.Mock = jest.fn()
  const setActiveTab: jest.Mock = jest.fn()
  const setOpenMenus: jest.Mock = jest.fn()

  const navigation: NavItem[] = [
    {
      name: 'Dashboard' as string,
      key: 'dashboard' as string,
      icon: MockIcon as React.FC,
    },
    {
      name: 'Projets' as string,
      key: 'projects' as string,
      icon: MockIcon as React.FC,
      children: [
        { name: 'Voir projets' as string, key: 'projects/list' as string, icon: MockIcon as React.FC, parentKey: 'projects' as string },
        { name: 'Créer projet' as string, key: 'projects/create' as string, icon: MockIcon as React.FC, parentKey: 'projects' as string, disabled: true },
      ],
    },
  ]

  const defaultProps: {
    navigation: NavItem[]
    sidebarOpen: boolean
    setSidebarOpen: jest.Mock
    activeTab: string
    setActiveTab: jest.Mock
    openMenus: string[]
    setOpenMenus: jest.Mock
  } = {
    navigation,
    sidebarOpen: true,
    setSidebarOpen,
    activeTab: 'dashboard',
    setActiveTab,
    openMenus: [],
    setOpenMenus,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all top-level items', () => {
    render(<SideBar {...defaultProps} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Projets')).toBeInTheDocument()
  })

  it('renders children only if menu is open', () => {
    const props = { ...defaultProps, openMenus: ['projects'] }
    render(<SideBar {...props} />)
    expect(screen.getByText('Voir projets')).toBeInTheDocument()
    expect(screen.getByText('Créer projet')).toBeInTheDocument()
  })

  it('calls setActiveTab and setSidebarOpen when clicking on top-level item without children', () => {
    render(<SideBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Dashboard'))
    expect(setActiveTab).toHaveBeenCalledWith('dashboard')
    expect(setSidebarOpen).toHaveBeenCalledWith(false)
  })

  it('toggles menu open when clicking on top-level item with children', () => {
    const props = { ...defaultProps, openMenus: [] }
    render(<SideBar {...props} />)
    fireEvent.click(screen.getByText('Projets'))
    expect(setOpenMenus).toHaveBeenCalledWith(expect.any(Function))
  })

  it('does not allow clicking disabled child items', () => {
    const props = { ...defaultProps, openMenus: ['projects'] }
    render(<SideBar {...props} />)
    const disabledButton: HTMLElement = screen.getByText('Créer projet')
    fireEvent.click(disabledButton)
    expect(setActiveTab).not.toHaveBeenCalled()
    expect(setSidebarOpen).not.toHaveBeenCalled()
  })

  it('renders icon for each item', () => {
    render(<SideBar {...defaultProps} />)
    const icons: HTMLElement[] = screen.getAllByTestId('icon')
    expect(icons.length).toBeGreaterThan(0)
  })
})