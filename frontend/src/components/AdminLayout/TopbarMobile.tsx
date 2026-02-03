import { LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import { useLang } from "@/context/Lang/LangContext"

export type NavItem = {
  name: string
  key: string
}

export type TopbarMobileProps = {
  activeTab: string
  navigation: NavItem[]
}

const TopbarMobile: React.FC<TopbarMobileProps> = ({ activeTab, navigation }: TopbarMobileProps): React.ReactElement => {
  const router: ReturnType<typeof useRouter> = useRouter()
  const { translations } = useLang()

  const handleLogout: () => void = (): void => {
    localStorage.removeItem("token");
    router.push("/admin/auth/login");
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-admin text-primary shadow">
      <span className="font-semibold text-lg capitaliz text-primary ">
        {navigation.find(n => n.key === activeTab)?.name}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-text hover:text-red-500 transition-colors"
        title={translations.navbarButtonLogout}
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  )
}
export default TopbarMobile;
