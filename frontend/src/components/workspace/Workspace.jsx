import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Workspace.module.css";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { HiOutlineTrash } from "react-icons/hi";
import {
  MdContentCopy,
  MdHistory,
  MdCheckCircle,
  MdInfoOutline,
  MdTimer,
} from "react-icons/md";
import { IoGlobeOutline } from "react-icons/io5";
import { processText } from "../../services/api";
import { useRateLimit, formatCooldown } from "../../hooks/useRateLimit";

// Example sentence kept for QA/testing reference
// Edit this or add more in mock-server/db.json
const EXAMPLE_INPUT =
  "Kumain na ko kanina sa labas, tapos nagedit na rin ako ng docs. Di ko na sya mahanap kaya nag-message na lang ako sa kanya.";

export default function Workspace() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [activeTab, setActiveTab] = useState("corrected");
  const [apiError, setApiError] = useState(null);
  const [analyzedText, setAnalyzedText] = useState("");

  // API response state — mirrors the api.md schema
  const [result, setResult] = useState(null);

  const textareaRef = useRef(null);

  // Rate limiting — see src/hooks/useRateLimit.js for rules
  const {
    analysisCount,
    isInputLimited,
    isSessionLimited,
    isLimited,
    cooldownSecs,
    recordAnalysis,
    resetInput,
  } = useRateLimit();

  const handleClear = () => {
    setInputText("");
    setShowOutput(false);
    setResult(null);
    setApiError(null);
    setAnalyzedText("");
    resetInput(); // resets per-input counter; session window stays
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() || isLimited) return;

    // Every click now counts towards the rolling session window (max 9 per 2 min)
    recordAnalysis();

    setIsAnalyzing(true);
    setShowOutput(false);
    setResult(null);
    setApiError(null);
    setAnalyzedText(inputText);

    try {
      // Calls src/services/api.js → mock-server or real Flask backend
      const data = await processText(inputText);
      setResult(data);
      setShowOutput(true);
    } catch (err) {
      const isTimeout =
        err.code === "ECONNABORTED" ||
        (typeof err.message === "string" &&
          err.message.toLowerCase().includes("timeout"));

      const isNetworkError =
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNREFUSED" ||
        err.message === "Network Error";

      setApiError(
        err.response?.data?.error ||
          (isTimeout
            ? "Backend timeout. Try again in a bit."
            : isNetworkError
              ? "Cannot connect to server. Run: node mock-server/server.cjs"
              : "An error occurred. Please try again."),
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Derive button label and indicator based on rate limit state
  const btnLabel = isLimited
    ? `Wait ${formatCooldown(cooldownSecs)}`
    : showOutput
      ? "Analyze Again"
      : isAnalyzing
        ? "Analyzing..."
        : "Analyze";

  // Word count + 2500 word limit
  const MAX_WORDS = 2500;
  const wordCount =
    inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;
  const isOverWordLimit = wordCount > MAX_WORDS;

  const btnDisabled =
    isAnalyzing || !inputText.trim() || isLimited || isOverWordLimit;

  const handleCopy = () => {
    if (result?.corrected) {
      navigator.clipboard.writeText(result.corrected);
    }
  };

  const getWords = (text) => {
    const trimmed = text.trim();
    return trimmed === "" ? [] : trimmed.split(/\s+/);
  };

  const normalizeToken = (token) => token.replace(/^'+/, "").toLowerCase();

  const computeDiff = (original, corrected) => {
    const originalWords = getWords(original);
    const correctedWords = getWords(corrected);
    const originalNorm = originalWords.map(normalizeToken);
    const correctedNorm = correctedWords.map(normalizeToken);
    const n = originalWords.length;
    const m = correctedWords.length;

    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = n - 1; i >= 0; i -= 1) {
      for (let j = m - 1; j >= 0; j -= 1) {
        dp[i][j] =
          originalNorm[i] === correctedNorm[j]
            ? dp[i + 1][j + 1] + 1
            : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    const changes = [];
    const wordChangeIds = Array(m).fill(null);
    let changeId = 0;
    let current = { originalWords: [], correctedWords: [], indices: [] };

    const flush = () => {
      if (
        current.originalWords.length > 0 ||
        current.correctedWords.length > 0
      ) {
        changes.push({
          original: current.originalWords.join(" "),
          corrected: current.correctedWords.join(" "),
          category: "Correction",
        });
        current.indices.forEach((idx) => {
          wordChangeIds[idx] = changeId;
        });
        changeId += 1;
      }
      current = { originalWords: [], correctedWords: [], indices: [] };
    };

    let i = 0;
    let j = 0;

    while (i < n && j < m) {
      if (originalNorm[i] === correctedNorm[j]) {
        flush();

        if (originalWords[i] !== correctedWords[j]) {
          changes.push({
            original: originalWords[i],
            corrected: correctedWords[j],
            category: "Correction",
          });
          wordChangeIds[j] = changeId;
          changeId += 1;
        }

        i += 1;
        j += 1;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        current.originalWords.push(originalWords[i]);
        i += 1;
      } else {
        current.correctedWords.push(correctedWords[j]);
        current.indices.push(j);
        j += 1;
      }
    }

    while (i < n) {
      current.originalWords.push(originalWords[i]);
      i += 1;
    }

    while (j < m) {
      current.correctedWords.push(correctedWords[j]);
      current.indices.push(j);
      j += 1;
    }

    flush();

    return { wordChangeIds, changes };
  };

  const diffData = useMemo(() => {
    if (!result?.corrected) {
      return { wordChangeIds: [], changes: [] };
    }

    const baseOriginal = result.original || analyzedText || inputText;
    return computeDiff(baseOriginal, result.corrected);
  }, [analyzedText, inputText, result]);

  const renderCorrectedText = () => {
    if (!result?.corrected) return null;

    const parts = [];
    const tokens = result.corrected.split(/(\s+)/);
    let wordIndex = 0;
    let highlightBuffer = [];
    let activeChangeId = null;
    let pendingSpace = "";

    const flushHighlight = () => {
      if (highlightBuffer.length === 0) return;
      parts.push(
        <span key={`corr-${parts.length}`} className={styles.correction}>
          {highlightBuffer.join("")}
        </span>,
      );
      highlightBuffer = [];
      activeChangeId = null;
    };

    tokens.forEach((token) => {
      if (token.trim() === "") {
        pendingSpace = token;
        return;
      }

      const changeId = diffData.wordChangeIds[wordIndex] ?? null;
      wordIndex += 1;

      if (changeId === null) {
        flushHighlight();
        if (pendingSpace) {
          parts.push(pendingSpace);
          pendingSpace = "";
        }
        parts.push(token);
        return;
      }

      if (activeChangeId === null) {
        flushHighlight();
        if (pendingSpace) {
          parts.push(pendingSpace);
          pendingSpace = "";
        }
        activeChangeId = changeId;
        highlightBuffer.push(token);
        return;
      }

      if (activeChangeId === changeId) {
        if (pendingSpace) {
          highlightBuffer.push(pendingSpace);
          pendingSpace = "";
        }
        highlightBuffer.push(token);
        return;
      }

      flushHighlight();
      if (pendingSpace) {
        parts.push(pendingSpace);
        pendingSpace = "";
      }
      activeChangeId = changeId;
      highlightBuffer.push(token);
    });

    flushHighlight();
    if (pendingSpace) {
      parts.push(pendingSpace);
    }
    return parts;
  };

  return (
    <section id="workspace" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>
            Taglish Correction <span>Workspace</span>
          </h2>
          <p className={styles.sectionCaption}>
            Experience real-time morphological analysis. Input your
            code-switched sentences and let our AI engine refine them.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Input Card */}
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <div className={styles.dot} />
                <span className={styles.title}>Your Text Input</span>
              </div>
              {inputText.length > 10 && (
                <div className={styles.badge}>
                  <IoGlobeOutline />
                  <span>Taglish Detected</span>
                </div>
              )}
            </div>

            <div className={styles.content}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                placeholder="I-type ang iyong Taglish text dito... (e.g. 'Kumain na ko kanina, nagedit pa rin ako ng files')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <span
                  className={`${styles.stat} ${isOverWordLimit ? styles.statOver : ""}`}
                >
                  {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()}{" "}
                  words
                </span>
              </div>
              <div className={styles.footerRight}>
                {inputText && (
                  <button className={styles.secondaryBtn} onClick={handleClear}>
                    <HiOutlineTrash />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  className={`${styles.analyzeBtn} ${isLimited ? styles.analyzeBtnCooldown : ""}`}
                  onClick={handleAnalyze}
                  disabled={btnDisabled}
                  title={
                    isOverWordLimit
                      ? `Text exceeds ${MAX_WORDS} word limit`
                      : undefined
                  }
                >
                  {isLimited ? (
                    <MdTimer className={styles.timerIcon} />
                  ) : (
                    <div className={styles.analyzeDot} />
                  )}
                  <span>{btnLabel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === "corrected" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("corrected")}
                >
                  <MdCheckCircle className={styles.tabIcon} />
                  <span>Corrected</span>
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "changed" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("changed")}
                >
                  <MdHistory className={styles.tabIcon} />
                  <span>Changed</span>
                </button>
              </div>
              {showOutput && (
                <button className={styles.copyBtn} onClick={handleCopy}>
                  <MdContentCopy />
                  <span>Copy</span>
                </button>
              )}
            </div>

            <div className={styles.content}>
              {isAnalyzing ? (
                <div className={styles.loadingState}>
                  <div className={styles.pulseWrapper}>
                    <div className={styles.pulseDot} />
                    <div className={styles.pulseDot} />
                    <div className={styles.pulseDot} />
                  </div>
                  <div className={styles.loadingText}>Analyzing Text...</div>
                </div>
              ) : apiError ? (
                <div className={styles.emptyOutput}>
                  <IoGlobeOutline className={styles.emptyIcon} />
                  <div className={styles.emptyText}>Connection Error</div>
                  <div className={styles.emptySubtext}>{apiError}</div>
                </div>
              ) : !showOutput ? (
                <div className={styles.emptyOutput}>
                  <IoGlobeOutline className={styles.emptyIcon} />
                  <div className={styles.emptyText}>
                    Corrected output will appear here
                  </div>
                  <div className={styles.emptySubtext}>
                    Enter Taglish text and click Analyze
                  </div>
                </div>
              ) : (
                <div className={styles.outputArea}>
                  {activeTab === "corrected" ? (
                    <>
                      {renderCorrectedText()}
                      <div className={styles.correctionHint}>
                        <MdInfoOutline />
                        <span>
                          Tap any green word to see why it was corrected
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.diffList}>
                      {diffData.changes.map((item, i) => (
                        <div key={i} className={styles.diffItem}>
                          <div className={styles.diffMain}>
                            <span className={styles.oldVal}>
                              {item.original}
                            </span>
                            <span className={styles.diffArrow}>&gt;</span>
                            <span className={styles.newVal}>
                              {item.corrected}
                            </span>
                          </div>
                          <div className={styles.diffMeta}>
                            <span className={styles.category}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                      ))}

                      {(result?.mixed_kept || []).length > 0 && (
                        <div className={styles.mixedStatus}>
                          <RiCheckboxCircleFill size={20} />
                          <span>
                            {result.mixed_kept.length} mixed-language{" "}
                            {result.mixed_kept.length === 1 ? "word" : "words"}{" "}
                            kept as-is ({result.mixed_kept.join(", ")})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <span className={styles.stat}>
                  {!showOutput ? (
                    "Waiting for your text"
                  ) : (
                    <>
                      {diffData.changes.length} corrections{" "}
                      <span className={styles.appliedText}>applied</span>
                    </>
                  )}
                </span>
              </div>
              {showOutput && (
                <div className={styles.footerRight}>
                  <div className={styles.analysisStatus}>
                    <RiCheckboxCircleFill />
                    <span className={styles.statusText}>Analysis Complete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
