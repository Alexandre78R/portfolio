type NavItem = {
  name: string
  key: string
}

type TopbarMobileProps = {
  activeTab: string
  navigation: NavItem[]
}

const TopbarMobile = ({ activeTab, navigation }: TopbarMobileProps): React.ReactElement => {
  return (
    <div className="md:hidden flex items-center justify-center p-4 bg-admin text-primary shadow">
      <span className="font-semibold text-lg capitaliz text-primary ">
        {navigation.find(n => n.key === activeTab)?.name}
      </span>
    </div>
  )
}
export default TopbarMobile;
