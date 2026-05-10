import HeroSection from '../components/hero/HeroSection.jsx'
import Workspace from '../components/workspace/Workspace.jsx'

export default function HomePage({ onGoToWorkspace }) {
  return (
    <>
      <HeroSection onGoToWorkspace={onGoToWorkspace} />
      <Workspace />
    </>
  )
}

