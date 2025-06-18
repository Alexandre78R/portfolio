import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import { ChevronDown, X } from 'lucide-react'

type NavItem = {
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

type SidebarProps = {
  navigation: NavItem[]
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  openMenus: string[]
  setOpenMenus: Dispatch<SetStateAction<string[]>>
}

export default function Sidebar({
  navigation,
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  openMenus,
  setOpenMenus,
}: SidebarProps) {
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

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
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigation.map((item) => {
            const isOpen = openMenus.includes(item.key)
            const hasChildren = !!item.children?.length

            return (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (hasChildren) toggleMenu(item.key)
                    else {
                      setActiveTab(item.key)
                      setSidebarOpen(false)
                    }
                  }}
                  className={clsx(
                    'flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-100 transition-all',
                    activeTab === item.key ? 'bg-gray-200 font-semibold' : ''
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </span>
                  {hasChildren && (
                    <ChevronDown
                      className={clsx(
                        'transition-transform duration-200',
                        isOpen ? 'rotate-180' : ''
                      )}
                    />
                  )}
                </button>
                {hasChildren && isOpen && (
                  <div className="pl-8 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.key}
                        onClick={() => {
                          setActiveTab(child.key)
                          setSidebarOpen(false)
                        }}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-1 rounded hover:bg-gray-100 w-full text-sm',
                          activeTab === child.key ? 'bg-gray-200 font-semibold' : ''
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}