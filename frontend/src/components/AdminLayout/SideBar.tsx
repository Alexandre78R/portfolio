import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'

type NavItem = {
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
}

type SidebarProps = {
  navigation: NavItem[]
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
}

export default function Sidebar({
  navigation,
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (
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
            aria-label="Close sidebar"
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
  )
}
