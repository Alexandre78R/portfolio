import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';
import { ChevronDown, X } from 'lucide-react';
import { useLang } from "@/context/Lang/LangContext";
import Lang from '@/lang/typeLang';
import { NavItem } from './Navigation';

type SidebarProps = {
  navigation: NavItem[]
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  openMenus: string[]
  setOpenMenus: Dispatch<SetStateAction<string[]>>
}

const SideBar = ({
  navigation,
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  openMenus,
  setOpenMenus,
}: SidebarProps): React.ReactElement => {

  const { translations } = useLang();

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const getTranslation = (
    translations: Lang | { [key: string]: string },
    key: string,
    fallback: string
  ): string => {
    const dict = translations as { [key: string]: string };
    return dict[key] ?? fallback;
  }

  return (
    <div
      className={clsx(
        'fixed top-[80px] left-0 z-40 w-80 bg-admin shadow-lg transform transition-transform duration-300 ease-in-out h-[calc(100vh-80px)]',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-5 font-bold text-xl border-b flex justify-between items-center text-primary hover:text-secondary">
          <span>Admin</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="overflow-y-auto p-4 space-y-4">
          {navigation.map((item) => {
            const isOpen = openMenus.includes(item.key);
            const hasChildren = !!item.children?.length;
            
            return (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (item.disabled) return;
                    if (hasChildren) toggleMenu(item.key);
                    else {
                      setActiveTab(item.key);
                      setSidebarOpen(false);
                    }
                  }}
                  className={clsx(
                    'flex items-center justify-between w-full px-4 py-2 rounded transition-all',
                    activeTab === item.key ? 'text-primary font-semibold' : 'text-primary',
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-primary hover:text-secondary'
                  )}
                  disabled={item.disabled}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {getTranslation(translations, `sideBarAdmin-${item.key}`, item.name)}
                    {item.disabled && <span className="ml-2">🔒</span>}
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
                  <div className="pl-8 mt-1 space-y-1 text-primary">
                    {item.children?.map((child) => (
                      <button
                        key={child.key}
                        onClick={() => {
                          if (child.disabled) return;
                          setActiveTab(child.key);
                          setSidebarOpen(false);
                        }}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-1 rounded w-full text-sm transition-all',
                          activeTab === child.key ? 'text-primary font-semibold' : '',
                          child.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-primary hover:text-secondary'
                        )}
                        disabled={child.disabled}
                      >
                        <child.icon className="w-4 h-4" />
                        {getTranslation(translations, `sideBarAdmin-${child.key}`, child.name)}
                        {child.disabled && <span className="ml-2">🔒</span>}
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

export default SideBar;