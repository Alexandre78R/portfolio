import { render, screen, fireEvent, RenderResult } from '@test-utils'
import SideBar, { SideBarProps } from '@/components/AdminLayout/SideBar'
import { NavItem } from '@/components/AdminLayout/Navigation'
import { Dispatch, SetStateAction, ComponentType } from 'react'

jest.mock('@/context/Lang/LangContext', () => ({
  useLang: (): { translations: Record<string, string> } => ({
    translations: {},
  }),
}))

const MockIcon: ComponentType<{ className?: string }> = (): JSX.Element => (
  <span data-testid="icon" />
)

describe('SideBar', () => {

  const setSidebarOpen: Dispatch<SetStateAction<boolean>> = jest.fn()
  const setActiveTab: (key: string) => void = jest.fn()
  const setOpenMenus: Dispatch<SetStateAction<string[]>> = jest.fn()

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      icon: MockIcon,
    },
    {
      name: 'Projets',
      key: 'projects',
      icon: MockIcon,
      children: [
        {
          name: 'Voir projets',
          key: 'projects/list',
          icon: MockIcon,
          parentKey: 'projects',
        },
        {
          name: 'Créer projet',
          key: 'projects/create',
          icon: MockIcon,
          parentKey: 'projects',
          disabled: true,
        },
      ],
    },
  ]

  const defaultProps: SideBarProps = {
    navigation,
    sidebarOpen: true,
    setSidebarOpen,
    activeTab: 'dashboard',
    setActiveTab,
    openMenus: [],
    setOpenMenus,
  }

  beforeEach((): void => {
    jest.clearAllMocks()
  })

  it('renders all top-level items', (): void => {
    const result: RenderResult = render(<SideBar {...defaultProps} />)

    const dashboard: HTMLElement = result.getByText('Dashboard')
    const projets: HTMLElement = result.getByText('Projets')

    expect(dashboard).toBeInTheDocument()
    expect(projets).toBeInTheDocument()
  })

  it('renders children only if menu is open', (): void => {
    const result: RenderResult = render(
      <SideBar {...defaultProps} openMenus={['projects']} />
    )

    const view: HTMLElement = result.getByText('Voir projets')
    const create: HTMLElement = result.getByText('Créer projet')

    expect(view).toBeInTheDocument()
    expect(create).toBeInTheDocument()
  })

  it('calls setActiveTab and setSidebarOpen when clicking item without children', (): void => {
    render(<SideBar {...defaultProps} />)

    const dashboardButton: HTMLElement = screen.getByText('Dashboard')
    fireEvent.click(dashboardButton)

    expect(setActiveTab).toHaveBeenCalledWith('dashboard')
    expect(setSidebarOpen).toHaveBeenCalledWith(false)
  })

  it('toggles menu when clicking item with children', (): void => {
    render(<SideBar {...defaultProps} />)

    const projectsButton: HTMLElement = screen.getByText('Projets')
    fireEvent.click(projectsButton)

    expect(setOpenMenus).toHaveBeenCalledWith(expect.any(Function))
  })

  it('does not allow clicking disabled child items', (): void => {
    render(<SideBar {...defaultProps} openMenus={['projects']} />)

    const disabledChild: HTMLElement = screen.getByText('Créer projet')
    fireEvent.click(disabledChild)

    expect(setActiveTab).not.toHaveBeenCalled()
    expect(setSidebarOpen).not.toHaveBeenCalled()
  })

  it('renders icons for items', (): void => {
    render(<SideBar {...defaultProps} />)

    const icons: HTMLElement[] = screen.getAllByTestId('icon')
    expect(icons.length).toBeGreaterThan(0)
  })
})
