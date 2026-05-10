import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">M</div>
          <span className={styles.brandText}>Morphism.</span>
        </div>
        
        <div className={styles.copyright}>
          © {year} Morphism. All rights reserved.
        </div>
        
        <div className={styles.links}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  )
}
