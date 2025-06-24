import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';

import Sidebar from '@/components/AdminLayout/SideBar';
import MobileOverlay from '@/components/AdminLayout/MobileOverlay';
import ToggleButton from '@/components/AdminLayout/ToggleButton';
import TopbarMobile from '@/components/AdminLayout/TopbarMobile';
import navigation, { NavItem } from './Navigation';
import { useUser } from '@/context/UserContext/UserContext';


const AdminLayout = ({ children }: { children: React.ReactNode }) : React.ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  // console.log('user dans AdminLayout', user.user?.role)
  const role = user.user?.role || 'view';

  const currentTab = useMemo(() => {
    const segments = pathname?.split('/') || []
    const index = segments.findIndex((segment) => segment === 'admin')
    return segments.slice(index + 1).join('/') || 'dashboard'
  }, [pathname])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  useEffect(() => {
    const parent = navigation.find((item) => item.children?.some(child => child.key === currentTab))
    if (parent && !openMenus.includes(parent.key)) {
      setOpenMenus((prev) => [...prev, parent.key])
    }
  }, [currentTab, openMenus])

  const filteredNavigation = useMemo<NavItem[]>(() => {
    const isAllowed = (roles?: string[]) => !roles || roles.includes(role)

    return navigation.map((item) => {
      const children = (item.children || []).map((child) => ({
        ...child,
        disabled: !isAllowed(child.roles),
      }))

      const disabled = !isAllowed(item.roles)

      return {
        ...item,
        children,
        disabled,
      }
    })
  }, [role])

  return (
    <div className="flex h-screen bg-body overflow-hidden">
      <Sidebar
        navigation={filteredNavigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={currentTab}
        setActiveTab={(key) => {
          setOpenMenus((prev) => {
            const parent = filteredNavigation.find(item => item.children?.some(child => child.key === key))
            if (parent && !prev.includes(parent.key)) {
              return [...prev, parent.key]
            }
            return prev
          })
          router.push(`/admin/${key}`)
        }}
        openMenus={openMenus}
        setOpenMenus={setOpenMenus}
      />

      {sidebarOpen && <MobileOverlay setSidebarOpen={setSidebarOpen} />}

      <div className={clsx('flex flex-col flex-1 pt-[80px] overflow-hidden', 'md:ml-80')}>
        <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <TopbarMobile activeTab={currentTab} navigation={filteredNavigation} />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout