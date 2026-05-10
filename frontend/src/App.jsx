import { useMemo, useState } from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import DocumentationPage from './pages/DocumentationPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  const [route, setRoute] = useState('home')

  const scrollToWorkspace = () => {
    if (route !== 'home') {
      setRoute('home')
      // Wait for route change to finish before scrolling
      setTimeout(() => {
        const el = document.getElementById('workspace')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById('workspace')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const page = useMemo(() => {
    if (route === 'docs') return <DocumentationPage />
    return <HomePage onGoToWorkspace={scrollToWorkspace} />
  }, [route])

  return (
    <div>
      <Navbar route={route} onRouteChange={setRoute} onScrollToWorkspace={scrollToWorkspace} />
      <main>{page}</main>
      <Footer />
    </div>
  )
}

export default App
