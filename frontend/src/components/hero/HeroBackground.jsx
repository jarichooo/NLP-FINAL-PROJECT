import styles from './HeroBackground.module.css'
import DotGrid from './DotGrid.jsx'

export default function HeroBackground({ children }) {
  return (
    <section className={styles.section}>
      <div className={`${styles.blob} ${styles.blobA}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobB}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobC}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobD}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobE}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobF}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.blobG}`} aria-hidden="true" />

      <DotGrid className={`${styles.dots} ${styles.dotsTopRight}`} />
      <DotGrid className={`${styles.dots} ${styles.dotsTopLeft}`} step={20} />
      <DotGrid className={`${styles.dots} ${styles.dotsBottomLeft}`} step={20} />

      <div className={styles.content}>{children}</div>
    </section>
  )
}
