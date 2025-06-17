import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import { Menu } from 'lucide-react'

type ToggleButtonProps = {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export default function ToggleButton({ sidebarOpen, setSidebarOpen }: ToggleButtonProps) {
  return (
    <button
      className={clsx(
        'absolute top-[88px] left-4 z-10 p-2 bg-white shadow rounded md:hidden',
        sidebarOpen && 'hidden'
      )}
      onClick={() => setSidebarOpen(true)}
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}