import styles from './Navbar.module.css'
import { useId, useState } from 'react'

function NavLink({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={active ? styles.navLinkActive : styles.navLink}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function Navbar({ route, onRouteChange, onScrollToWorkspace }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  const go = (next) => {
    onRouteChange(next)
    setOpen(false)
  }

  const handleWorkspaceClick = () => {
    onScrollToWorkspace()
    setOpen(false)
  }

  return (
    <header className={open ? `${styles.header} ${styles.headerOpen}` : styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand} onClick={() => go('home')}>
          <div className={styles.logo} aria-hidden="true">
            M
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Morphism.</span>
            <span className={styles.beta}>BETA</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.navDesktop}>
            <NavLink active={route === 'home'} onClick={() => go('home')}>
              Home
            </NavLink>
            <NavLink active={route === 'docs'} onClick={() => go('docs')}>
              Documentation
            </NavLink>
            <button type="button" className={styles.workspaceCta} onClick={handleWorkspaceClick}>
              Go to Workspace
            </button>
          </div>

          <button
            type="button"
            className={open ? styles.menuBtnOpen : styles.menuBtn}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              {open ? '×' : '☰'}
            </span>
          </button>
        </nav>
      </div>

      <div id={menuId} className={open ? styles.menuPanelOpen : styles.menuPanel}>
        <div className={styles.menuInner}>
          <NavLink active={route === 'home'} onClick={() => go('home')}>
            Home
          </NavLink>
          <NavLink active={route === 'docs'} onClick={() => go('docs')}>
            Documentation
          </NavLink>
          <button type="button" className={styles.workspaceCtaMobile} onClick={handleWorkspaceClick}>
            Go to Workspace
          </button>
        </div>
      </div>

      <div 
        className={open ? styles.backdropOpen : styles.backdrop} 
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </header>
  )
}
