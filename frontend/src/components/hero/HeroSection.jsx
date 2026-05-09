import HeroBackground from "./HeroBackground.jsx";
import HeroGraphic from "./HeroGraphic.jsx";
import styles from "./HeroSection.module.css";
import { FaBookOpen } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";

const FEATURES = [
  "Contextual Error Detection",
  "Rule-Based Morphological Correction",
  "Preservation of Linguistic Voice",
  "KWF-Standard Alignment",
];

export default function HeroSection({ onGoToWorkspace }) {
  return (
    <HeroBackground>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.pill}>
              <span className={styles.pillDot} aria-hidden="true" />
              <span>
                Powered by Hybrid Deep Learning &amp; Rule-Based Logic
              </span>
            </div>

            <h1 className={styles.title}>
              Tagalog-English Grammar{" "}
              <span className={styles.titleGreen}>
                Detection and Correction
              </span>
            </h1>

            <p className={styles.subtitle}>
              An AI-powered grammar checker built specifically for Taglish. Fix
              structural errors, correct word-bonding, and refine your
              code-switched sentences instantly while keeping your natural flow.
            </p>

            <ul className={styles.featureList}>
              {FEATURES.map((item) => (
                <li key={item} className={styles.featureItem}>
                  <RiCheckboxCircleFill
                    className={styles.checkCircleIcon}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.ctas}>
              <button
                type="button"
                className={styles.primary}
                onClick={onGoToWorkspace}
              >
                <span>Get Started</span>
                <GoArrowRight className={styles.btnIcon} aria-hidden="true" />
              </button>
              <button type="button" className={styles.secondary}>
                <FaBookOpen className={styles.btnIcon} aria-hidden="true" />
                <span>View Documentation</span>
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>94%</div>
                <div className={styles.statLabel}>PRECISION</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>21K+</div>
                <div className={styles.statLabel}>CORPUS ROWS</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>&lt; 150ms</div>
                <div className={styles.statLabel}>REAL-TIME LATENCY</div>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <HeroGraphic />
          </div>
        </div>
      </div>
    </HeroBackground>
  );
}
