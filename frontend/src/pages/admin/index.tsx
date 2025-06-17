'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Menu, X, LayoutDashboard, User, Settings } from 'lucide-react'

import Sidebar from '@/components/AdminLayout/SideBar';
import MobileOverlay from '@/components/AdminLayout/MobileOverlay';
import ToggleButton from '@/components/AdminLayout/ToggleButton';
import TopbarMobile from '@/components/AdminLayout/TopbarMobile';
import MainContent from '@/components/AdminLayout/MainContent';

const navigation = [
  { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
  { name: 'Utilisateurs', key: 'users', icon: User },
  { name: 'Paramètres', key: 'settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="flex h-screen bg-body overflow-hidden">
      <Sidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {sidebarOpen && (
        <MobileOverlay setSidebarOpen={setSidebarOpen} />
      )}

      <div
        className={clsx(
          'flex flex-col flex-1 pt-[80px] overflow-hidden',
          'md:ml-64'
        )}
      >
        <ToggleButton
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <TopbarMobile
          activeTab={activeTab}
          navigation={navigation}
        />

        <MainContent activeTab={activeTab} />
      </div>
    </div>
  )
}