import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

import Sidebar from '@/components/AdminLayout/SideBar';
import MobileOverlay from '@/components/AdminLayout/MobileOverlay';
import ToggleButton from '@/components/AdminLayout/ToggleButton';
import TopbarMobile from '@/components/AdminLayout/TopbarMobile';
import navigation from './Navigation';

export type NavItem = {
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const AdminLayout = ({ children }: { children: React.ReactNode }) : React.ReactElement => {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = useMemo(() => {
    // const slug = pathname?.split('/').pop() || 'dashboard';
    // return slug
    const segments = pathname?.split('/') || []
    const tab = segments[2] || 'dashboard';
    return tab
  }, [pathname])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  return (
    <div className="flex h-screen bg-body overflow-hidden">
      <Sidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={currentTab}
        setActiveTab={(key) => router.push(`/admin/${key}`)}
        openMenus={openMenus}
        setOpenMenus={setOpenMenus}
      />

      {sidebarOpen && <MobileOverlay setSidebarOpen={setSidebarOpen} />}

      <div className={clsx('flex flex-col flex-1 pt-[80px] overflow-hidden', 'md:ml-64')}>
        <ToggleButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <TopbarMobile activeTab={currentTab} navigation={navigation} />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;