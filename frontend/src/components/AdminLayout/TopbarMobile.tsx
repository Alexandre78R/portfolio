type NavItem = {
  name: string
  key: string
}

type TopbarMobileProps = {
  activeTab: string
  navigation: NavItem[]
}

export default function TopbarMobile({ activeTab, navigation }: TopbarMobileProps) {
  return (
    <div className="md:hidden flex items-center justify-center p-4 bg-white shadow">
      <span className="font-semibold text-lg capitalize">
        {navigation.find(n => n.key === activeTab)?.name}
      </span>
    </div>
  )
}
