import { useMemo, useState } from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import DocumentationPage from './pages/DocumentationPage.jsx'
import HomePage from './pages/HomePage.jsx'
import WorkspacePage from './pages/WorkspacePage.jsx'

function App() {
  const [route, setRoute] = useState('home')

  const page = useMemo(() => {
    if (route === 'docs') return <DocumentationPage />
    if (route === 'workspace') return <WorkspacePage />
    return <HomePage onGoToWorkspace={() => setRoute('workspace')} />
  }, [route])

  return (
    <div>
      <Navbar route={route} onRouteChange={setRoute} />
      <main>{page}</main>
    </div>
  )
}

export default App
