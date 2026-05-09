import styles from './PageShell.module.css'

export default function WorkspacePage() {
  return (
    <section className={styles.shell}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Workspace</h1>
        <p className={styles.muted}>We’ll wire the editor here after the hero.</p>
      </div>
    </section>
  )
}

