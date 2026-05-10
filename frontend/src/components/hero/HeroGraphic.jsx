import { useEffect, useMemo, useState, useRef } from "react";
import styles from "./HeroGraphic.module.css";

const SAMPLES = [
  {
    before: "Ang daming bobong DDS sa comment section. Kaya hindi na nakaka-surprise kung bakit si Sara ang gusto nilang maging president.",
    after: "Ang daming bobong DDS sa comment section. Kaya hindi na nakaka-surprise kung bakit si Sara ang gusto nilang maging president.",
    corrections: 0,
    accuracy: 100.0,
    tokens: [
      { text: "Ang daming bobong DDS sa comment section. Kaya hindi na nakaka-surprise kung bakit si Sara ang gusto nilang maging president.", error: false }
    ],
    highlights: []
  },
  {
    before: "respect My opinion nalng kung sino gusto ko maging president kasi hindi naman kayo yung magvovote para sakin. So stop judging me.",
    after: "Respect my opinion na lang kung sino ang gusto kong maging president kasi hindi naman kayo ang magvo-vote para sa akin. So stop judging me.",
    corrections: 8,
    accuracy: 94.2,
    tokens: [
      { text: "respect", error: true },
      { text: " ", error: false },
      { text: "My", error: true },
      { text: " opinion ", error: false },
      { text: "nalng", error: true },
      { text: " kung ", error: false },
      { text: "sino", error: true },
      { text: " ", error: false },
      { text: "gusto ko", error: true },
      { text: " maging president kasi hindi naman ", error: false },
      { text: "kayo yung", error: true },
      { text: " ", error: false },
      { text: "magvovote", error: true },
      { text: " para ", error: false },
      { text: "sakin", error: true },
      { text: ". So stop judging me.", error: false }
    ],
    highlights: [
      "Respect", "my", "na lang", "ang", "kong", "ang", "magvo-vote", "sa akin"
    ]
  }
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
    return <span className={styles.chipIcon} aria-hidden="true">{"\u270E"}</span>;
  if (type === "negation")
    return <span className={styles.chipIcon} aria-hidden="true">{"\u2298"}</span>;
  if (type === "pronoun")
    return <span className={styles.chipIcon} aria-hidden="true">{"\u263A"}</span>;
  if (type === "order")
    return <span className={styles.chipIcon} aria-hidden="true">{"\u21C4"}</span>;
  return <span className={styles.sparkleIcon} aria-hidden="true">{"\u2726"}</span>;
}

export default function HeroGraphic() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [displayedBefore, setDisplayedBefore] = useState("");
  const [processed, setProcessed] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [showChips, setShowChips] = useState(false);

  const sample = SAMPLES[sampleIndex];

  const afterContent = useMemo(() => {
    // Show "Analyzing..." until the analysis is 100% complete
    if (!processed) return "Analyzing your text...";
    
    if (sampleIndex === 0) return sample.after;

    const text = sample.after;
    let parts = text.split(/(Respect|my|na lang|ang|kong|magvo-vote|sa akin)/);
    return (
      <>
        {parts.map((part, i) => 
          sample.highlights.includes(part) ? (
            <span key={i} className={styles.afterGood}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }, [processed, sampleIndex, sample]);

  useEffect(() => {
    let cancelled = false;
    let mainLoop = null;

    const startAnimation = async () => {
      // 1. Reset
      setProcessed(false);
      setProgress(0);
      setDisplayPercent(0);
      setShowChips(false);
      setDisplayedBefore("");

      // 2. Typing animation (1s)
      const fullText = sample.before;
      const chars = fullText.split("");
      const typeDelay = 1000 / chars.length;
      
      for (let i = 0; i <= chars.length; i++) {
        if (cancelled) return;
        setDisplayedBefore(fullText.substring(0, i));
        await new Promise(r => setTimeout(r, typeDelay));
      }

      await new Promise(r => setTimeout(r, 400));

      // 3. Start Loading (1.8s)
      if (cancelled) return;
      setProgress(100); // Visual bar (CSS transition)

      const startT = Date.now();
      const pInterval = setInterval(() => {
        if (cancelled) {
          clearInterval(pInterval);
          return;
        }
        const elapsed = Date.now() - startT;
        const p = Math.min((elapsed / 1800) * 100, 100);
        setDisplayPercent(p);
        if (p >= 100) clearInterval(pInterval);
      }, 30);

      await new Promise(r => setTimeout(r, 1800));

      // 4. Complete
      if (cancelled) return;
      setProcessed(true);
      setTimeout(() => {
        if (!cancelled) setShowChips(true);
      }, 400);
    };

    startAnimation();

    mainLoop = setInterval(() => {
      if (!cancelled) {
        setSampleIndex(prev => (prev === 0 ? 1 : 0));
      }
    }, 12000);

    return () => {
      cancelled = true;
      clearInterval(mainLoop);
    };
  }, [sampleIndex, sample]);

  return (
    <div className={styles.outer} aria-label="Live correction preview graphic">
      {FLOATING_TAGS.map((tag) => (
        <div key={tag.label} className={`${styles.floatingTag} ${styles[`tag_${tag.label}`]}`}>
          <span className={styles.tagIcon} aria-hidden="true">{"\u25CF"}</span>
          <span className={styles.tagCode}>{tag.label}</span>
          <span className={styles.tagName}>{tag.name}</span>
        </div>
      ))}

      {showChips && RULE_CHIPS.map((chip, i) => (
        <div key={chip.label} className={`${styles.ruleChip} ${styles[`chip_${chip.edge}`]} ${styles[`chip${chip.pos}`]} ${styles[`delay${i}`]}`}>
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
              <span className={styles.liveText}>MORPHIS · Live Correction</span>
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
              {processed && sampleIndex === 1 ? (
                sample.tokens.map((tok, i) => (
                  <span key={i} className={tok.error ? styles.beforeBad : ""}>{tok.text}</span>
                ))
              ) : (
                displayedBefore
              )}
            </p>
          </div>

          <div className={styles.progressRow}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={processed ? styles.progressDone : styles.progressText}>
              {processed ? "\u2713 Complete" : `${Math.round(displayPercent)}%`}
            </span>
          </div>

          <div>
            <div className={styles.sectionTitleRow}>
              <span className={processed ? styles.sectionTitleAfterOn : styles.sectionTitleAfterOff}>AFTER</span>
              <span className={processed ? styles.hrAfterOn : styles.hrAfterOff} aria-hidden="true" />
            </div>
            <p className={processed ? styles.afterLineOn : styles.afterLineOff}>
              {afterContent}
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span className={processed ? styles.footerTextOn : styles.footerTextOff}>
              {sample.corrections} corrections applied
            </span>
          </div>
          <div className={styles.footerItem}>
            <span className={processed ? styles.miniDotOn : styles.miniDotOff} aria-hidden="true" />
            <span className={processed ? styles.footerMutedOn : styles.footerMutedOff}>
              {sample.accuracy}% accuracy
            </span>
          </div>
          <div className={styles.footerArrow}>
            <span className={processed ? styles.arrowOn : styles.arrowOff} aria-hidden="true">{"\u2192"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
