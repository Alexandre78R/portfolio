import { ReactNode, ReactElement, useMemo, useState, useEffect } from 'react'
import clsx from 'clsx'
import Sidebar from './SideBar';
import MobileOverlay from './MobileOverlay';
import ToggleButton from './ToggleButton';
import TopbarMobile from './TopbarMobile';
import navigation, { NavItem } from './Navigation';
import { useUser, UserContextType } from '@/context/UserContext/UserContext';
import { usePathname, useRouter } from 'next/navigation';

export interface AdminLayoutProps {
  children: ReactNode
}

export type Role = 'admin' | 'editor' | 'view' | 'unknown';

const AdminLayout = ({ children }: AdminLayoutProps): ReactElement => {
  const pathname: string = usePathname() ?? '';
  const router: ReturnType<typeof useRouter> = useRouter();

  const { user }: { user: UserContextType['user'] } = useUser();
  const role: Role = (user?.role as Role) ?? 'unknown';

  const currentTab: string = useMemo(() => {
    const segments: string[] = pathname.split('/');
    const adminIndex: number = segments.findIndex(seg => seg === 'admin');
    return segments.slice(adminIndex + 1).join('/') || 'dashboard';
  }, [pathname])

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    const parent: NavItem | undefined = navigation.find(item =>
      item.children?.some(child => child.key === currentTab)
    )
    if (parent && !openMenus.includes(parent.key)) {
      setOpenMenus(prev => [...prev, parent.key])
    }
  }, [currentTab, openMenus])

  const filteredNavigation: NavItem[] = useMemo(() => {
    const isAllowed = (roles?: Role[]): boolean => !roles || roles.includes(role)

    return navigation.map(item => ({
      ...item,
      disabled: !isAllowed(item.roles),
      children: item.children?.map(child => ({
        ...child,
        disabled: !isAllowed(child.roles),
      })),
    }))
  }, [role]);

  const handleSetActiveTab = (key: string): void => {
    const parent: NavItem | undefined = filteredNavigation.find(item =>
      item.children?.some(child => child.key === key)
    )
    if (parent && !openMenus.includes(parent.key)) {
      setOpenMenus(prev => [...prev, parent.key])
    }
    router.push(`/admin/${key}`)
  }

  return (
    <div className="flex h-screen bg-body overflow-hidden">
      <Sidebar
        navigation={filteredNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={currentTab}
        setActiveTab={handleSetActiveTab}
        openMenus={openMenus}
        setOpenMenus={setOpenMenus}
      />

      {sidebarOpen && <MobileOverlay setSidebarOpen={setSidebarOpen} />}

      <div className={clsx('flex flex-col flex-1 pt-[80px] overflow-hidden', 'md:ml-80')}>
        <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <TopbarMobile activeTab={currentTab} navigation={filteredNavigation} />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout