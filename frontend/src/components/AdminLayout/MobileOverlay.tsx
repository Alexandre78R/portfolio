import { Dispatch, SetStateAction } from 'react'

type MobileOverlayProps = {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export default function MobileOverlay({ setSidebarOpen }: MobileOverlayProps) {
  return (
    <div
      className="fixed top-[80px] left-0 right-0 bottom-0 z-30 bg-black bg-opacity-40 md:hidden"
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />
  )
}
