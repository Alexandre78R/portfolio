import { Dispatch, ReactElement, SetStateAction } from 'react'
import clsx from 'clsx'
import { Menu } from 'lucide-react'

type ToggleButtonProps = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const ToggleButton = ({ sidebarOpen, setSidebarOpen }: ToggleButtonProps) : React.ReactElement => {
  return (
    <button
      className={clsx(
        'absolute top-[88px] left-4 z-10 p-2 bg-admin shadow rounded md:hidden',
        sidebarOpen && 'hidden'
      )}
      onClick={() => setSidebarOpen(true)}
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5 text-primary" />
    </button>
  )
}

export default ToggleButton;