import { useState, useRef } from "react";
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

  /**
   * Renders the corrected output with highlighted correction spans.
   * detected_errors contains { original, corrected } pairs used to mark changed words.
   */
  const renderCorrectedText = () => {
    if (!result) return null;

    let text = result.corrected;
    const parts = [];
    let lastIndex = 0;

    // Build sorted list of corrections to highlight
    const highlights = [...(result.detected_errors || [])].sort(
      (a, b) => a.position - b.position,
    );

    for (const err of highlights) {
      const idx = text.indexOf(err.corrected, lastIndex);
      if (idx === -1) continue;

      // Text before correction
      if (idx > lastIndex) {
        parts.push(
          <span key={`plain-${lastIndex}`}>{text.slice(lastIndex, idx)}</span>,
        );
      }

      // Highlighted corrected word
      parts.push(
        <span key={`corr-${idx}`} className={styles.correction}>
          {err.corrected}
        </span>,
      );
      lastIndex = idx + err.corrected.length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="tail">{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
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
                      {(result?.detected_errors || []).map((item, i) => (
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
                      {result?.detected_errors?.length ?? 0} corrections{" "}
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
