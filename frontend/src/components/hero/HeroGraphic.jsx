import { useEffect, useMemo, useState } from "react";
import styles from "./HeroGraphic.module.css";

const BEFORE_TOKENS = [
  { text: "andaming", error: true },
  { text: " ", error: false },
  { text: "bobong", error: false },
  { text: " ", error: false },
  { text: "dds", error: true },
  { text: " ", error: false },
  { text: "sa", error: false },
  { text: " ", error: false },
  { text: "Comment", error: true },
  { text: " ", error: false },
  { text: "section!", error: false },
  { text: " ", error: false },
  { text: "lol.", error: true },
  { text: " ", error: false },
  { text: "di", error: true },
  { text: " ", error: false },
  { text: "nako", error: true },
  { text: " ", error: false },
  { text: "magtataka kung", error: false },
  { text: " ", error: false },
  { text: "bat", error: true },
  { text: " ", error: false },
  { text: "si Sara ang future president nila.", error: false },
];

const FLOATING_TAGS = [
  { label: "VB", name: "Verb" },
  { label: "PNN", name: "Pronoun" },
  { label: "NN", name: "Noun" },
];

const RULE_CHIPS = [
  { label: "Spelling Fix", icon: "spell", edge: "top", pos: "A" },
  { label: "Negation", icon: "negation", edge: "top", pos: "B" },
  { label: "Pronoun Fix", icon: "pronoun", edge: "bottom", pos: "C" },
  { label: "Word Order", icon: "order", edge: "bottom", pos: "D" },
];

function RuleIcon({ type }) {
  if (type === "spell")
    return (
      <span className={styles.chipIcon} aria-hidden="true">
        {"\u270E"}
      </span>
    );
  if (type === "negation")
    return (
      <span className={styles.chipIcon} aria-hidden="true">
        {"\u2298"}
      </span>
    );
  if (type === "pronoun")
    return (
      <span className={styles.chipIcon} aria-hidden="true">
        {"\u263A"}
      </span>
    );
  if (type === "order")
    return (
      <span className={styles.chipIcon} aria-hidden="true">
        {"\u21C4"}
      </span>
    );
  return (
    <span className={styles.sparkleIcon} aria-hidden="true">
      {"\u2726"}
    </span>
  );
}

export default function HeroGraphic() {
  const [processed, setProcessed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showChips, setShowChips] = useState(false);

  const afterLine = useMemo(() => {
    if (!processed) return "Analyzing your text...";
    return (
      <>
        <span className={styles.afterGood}>Ang daming</span> bobong{" "}
        <span className={styles.afterGood}>DDS</span> sa{" "}
        <span className={styles.afterGood}>comment</span> section.{" "}
        <span className={styles.afterGood}>LOL</span>.{" "}
        <span className={styles.afterGood}>Hindi</span>{" "}
        <span className={styles.afterGood}>na ako</span> magtataka kung{" "}
        <span className={styles.afterGood}>bakit</span> si Sara ang future
        president nila.
      </>
    );
  }, [processed]);

  useEffect(() => {
    let cancelled = false;
    let startTimer = null;
    let loopTimer = null;

    const runAnimation = () => {
      setProcessed(false);
      setProgress(0);
      setShowChips(false);

      startTimer = setTimeout(() => {
        const tick = setInterval(() => {
          if (cancelled) {
            clearInterval(tick);
            return;
          }
          setProgress((p) => {
            if (p >= 100) {
              clearInterval(tick);
              setProcessed(true);
              setTimeout(() => {
                if (!cancelled) setShowChips(true);
              }, 350);
              return 100;
            }
            return p + 3.5;
          });
        }, 40);
      }, 800);
    };

    runAnimation();
    loopTimer = setInterval(() => {
      if (!cancelled) runAnimation();
    }, 9000);

    return () => {
      cancelled = true;
      if (startTimer) clearTimeout(startTimer);
      if (loopTimer) clearInterval(loopTimer);
    };
  }, []);

  return (
    <div className={styles.outer} aria-label="Live correction preview graphic">
      {FLOATING_TAGS.map((tag) => (
        <div
          key={tag.label}
          className={`${styles.floatingTag} ${styles[`tag_${tag.label}`]}`}
        >
          <span className={styles.tagIcon} aria-hidden="true">
            {"\u25CF"}
          </span>
          <span className={styles.tagCode}>{tag.label}</span>
          <span className={styles.tagName}>{tag.name}</span>
        </div>
      ))}

      {showChips &&
        RULE_CHIPS.map((chip, i) => (
          <div
            key={chip.label}
            className={`${styles.ruleChip} ${styles[`chip_${chip.edge}`]} ${styles[`chip${chip.pos}`]} ${styles[`delay${i}`]}`}
          >
            <RuleIcon type={chip.icon} />
            <span className={styles.ruleText}>{chip.label}</span>
          </div>
        ))}

      <div className={styles.card}>
        <div className={styles.chrome}>
          <div className={styles.traffic} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <div className={styles.chromeCenter}>
            <div className={styles.livePill}>
              <span className={styles.livePulse} aria-hidden="true" />
              <span className={styles.liveText}>
                SYMMETRY · Live Correction
              </span>
            </div>
          </div>
          <div className={styles.chromeRight} aria-hidden="true" />
        </div>

        <div className={styles.body}>
          <div>
            <div className={styles.sectionTitleRow}>
              <span className={styles.sectionTitle}>BEFORE</span>
              <span className={styles.hr} aria-hidden="true" />
            </div>
            <p className={styles.beforeLine}>
              {BEFORE_TOKENS.map((tok, i) =>
                tok.error ? (
                  <span key={i} className={styles.beforeBad}>
                    {tok.text}
                  </span>
                ) : (
                  <span key={i}>{tok.text}</span>
                ),
              )}
            </p>
          </div>

          <div className={styles.progressRow}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span
              className={processed ? styles.progressDone : styles.progressText}
            >
              {processed ? "\u2713 Complete" : `${Math.round(progress)}%`}
            </span>
          </div>

          <div>
            <div className={styles.sectionTitleRow}>
              <span
                className={
                  processed
                    ? styles.sectionTitleAfterOn
                    : styles.sectionTitleAfterOff
                }
              >
                AFTER
              </span>
              <span
                className={processed ? styles.hrAfterOn : styles.hrAfterOff}
                aria-hidden="true"
              />
            </div>
            <p className={processed ? styles.afterLineOn : styles.afterLineOff}>
              {afterLine}
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span
              className={processed ? styles.checkIconOn : styles.checkIconOff}
              aria-hidden="true"
            >
              {"\u2713"}
            </span>
            <span
              className={processed ? styles.footerTextOn : styles.footerTextOff}
            >
              7 corrections applied
            </span>
          </div>
          <div className={styles.footerItem}>
            <span
              className={processed ? styles.miniDotOn : styles.miniDotOff}
              aria-hidden="true"
            />
            <span
              className={
                processed ? styles.footerMutedOn : styles.footerMutedOff
              }
            >
              95.8% accuracy
            </span>
          </div>
          <div className={styles.footerArrow}>
            <span
              className={processed ? styles.arrowOn : styles.arrowOff}
              aria-hidden="true"
            >
              {"\u2192"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
