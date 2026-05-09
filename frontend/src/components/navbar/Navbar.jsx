import styles from './Navbar.module.css'

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

export default function Navbar({ route, onRouteChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand} onClick={() => onRouteChange('home')}>
          <div className={styles.logo} aria-hidden="true">
            M
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Morphism.</span>
            <span className={styles.beta}>BETA</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink active={route === 'home'} onClick={() => onRouteChange('home')}>
            Home
          </NavLink>
          <NavLink active={route === 'docs'} onClick={() => onRouteChange('docs')}>
            Documentation
          </NavLink>
          <button
            type="button"
            className={styles.workspaceCta}
            onClick={() => onRouteChange('workspace')}
          >
            Go to Workspace
          </button>
        </nav>
      </div>
    </header>
  )
}

