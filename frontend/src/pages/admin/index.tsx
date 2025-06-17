'use client'

import { useState } from 'react'
import { Menu, X, LayoutDashboard, User, Settings } from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
  { name: 'Utilisateurs', key: 'users', icon: User },
  { name: 'Paramètres', key: 'settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <p className="text-primary">Bienvenue sur le dashboard 👋</p>
      case 'users':
        return <p className="text-primary">Ici tu gères tes utilisateurs.</p>
      case 'settings':
        return <p className="text-primary">Réglages de l’application.</p>
      default:
        return <p>Dashboard</p>
    }
  }

  return (
    <div className="flex h-screen bg-body overflow-hidden">
      {/* Sidebar */}
      <div
        className={clsx(
          'fixed top-[80px] left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out h-[calc(100vh-80px)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 font-bold text-xl border-b flex justify-between items-center">
            <span>🧠 Admin</span>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key)
                  setSidebarOpen(false)
                }}
                className={clsx(
                  'flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-gray-100 transition-all',
                  activeTab === item.key ? 'bg-gray-200 font-semibold' : ''
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed top-[80px] left-0 right-0 bottom-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={clsx(
          'flex flex-col flex-1 pt-[80px] overflow-hidden',
          // IMPORTANT : on décale le contenu sur desktop pour ne pas être caché par la sidebar
          'md:ml-64'
        )}
      >
        {/* Toggle button */}
        <button
          className={clsx(
            'absolute top-[88px] left-4 z-10 p-2 bg-white shadow rounded md:hidden',
            sidebarOpen && 'hidden'
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Topbar mobile */}
        <div className="md:hidden flex items-center justify-center p-4 bg-white shadow">
          <span className="font-semibold text-lg capitalize">
            {navigation.find(n => n.key === activeTab)?.name}
          </span>
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}