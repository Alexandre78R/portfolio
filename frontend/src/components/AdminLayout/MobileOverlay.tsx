import { Dispatch, SetStateAction, ReactElement } from 'react'

export interface MobileOverlayProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({ setSidebarOpen }: MobileOverlayProps): ReactElement => {
  return (
    <div
      data-testid="overlay"
      className="fixed top-[80px] left-0 right-0 bottom-0 z-30 bg-black bg-opacity-40 md:hidden"
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />
  )
}

export default MobileOverlay