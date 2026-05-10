import styles from './PageShell.module.css'

export default function DocumentationPage() {
  return (
    <section className={styles.shell}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Documentation</h1>
        <p className={styles.muted}>Coming next.</p>
      </div>
    </section>
  )
}

