import HeroBackground from "./HeroBackground.jsx";
import HeroGraphic from "./HeroGraphic.jsx";
import styles from "./HeroSection.module.css";
import { FaBookOpen } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { motion } from "framer-motion";

const FEATURES = [
  "Contextual Error Detection",
  "Rule-Based Morphological Correction",
  "Preservation of Linguistic Voice",
  "KWF-Standard Alignment",
];

export default function HeroSection({ onGoToWorkspace }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <HeroBackground>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <motion.div 
              className={styles.pill}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.1 }}
            >
              <span className={styles.pillDot} aria-hidden="true" />
              <span>
                Powered by Hybrid Deep Learning &amp; Rule-Based Logic
              </span>
            </motion.div>

            <motion.h1 
              className={styles.title}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.2 }}
            >
              Tagalog-English Grammar{" "}
              <span className={styles.titleGreen}>
                Detection and Correction
              </span>
            </motion.h1>

            <motion.p 
              className={styles.subtitle}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.3 }}
            >
              An AI-powered grammar checker built specifically for Taglish. Fix
              structural errors, correct word-bonding, and refine your
              code-switched sentences instantly while keeping your natural flow.
            </motion.p>

            <motion.ul 
              className={styles.featureList}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.4 }}
            >
              {FEATURES.map((item) => (
                <li key={item} className={styles.featureItem}>
                  <RiCheckboxCircleFill
                    className={styles.checkCircleIcon}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div 
              className={styles.ctas}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.5 }}
            >
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
            </motion.div>

            <motion.div 
              className={styles.stats}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
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
            </motion.div>
          </div>

          <motion.div 
            className={styles.right}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            <HeroGraphic />
          </motion.div>
        </div>
      </div>
    </HeroBackground>
  );
}
