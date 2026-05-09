import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './Workspace.module.css'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { HiOutlineTrash, HiOutlineSparkles } from 'react-icons/hi'
import { MdContentCopy, MdHistory, MdCheckCircle, MdInfoOutline } from 'react-icons/md'
import { IoGlobeOutline } from 'react-icons/io5'

export default function Workspace() {
  const [inputText, setInputText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [activeTab, setActiveTab] = useState('corrected')
  const textareaRef = useRef(null)

  const handleClear = () => {
    setInputText('')
    setShowOutput(false)
  }

  const handleLoadExample = () => {
    setInputText('Kumain na ko kanina sa labas, tapos nagedit na rin ako ng docs. Di ko na sya mahanap kaya nag-message na lang ako sa kanya.')
  }

  const handleAnalyze = () => {
    if (!inputText.trim()) return
    setIsAnalyzing(true)
    setShowOutput(false)
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowOutput(true)
    }, 1800)
  }

  const charCount = inputText.length

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
            Experience real-time morphological analysis. Input your code-switched sentences and let our AI engine refine them.
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
                <span className={styles.stat}>{charCount} chars</span>
                {inputText && (
                  <button className={styles.actionBtn} onClick={handleClear}>
                    <HiOutlineTrash />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className={styles.footerRight}>
                <button className={styles.secondaryBtn} onClick={handleLoadExample}>
                  <HiOutlineSparkles />
                  <span>Load Example</span>
                </button>
                <button 
                  className={styles.analyzeBtn} 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                >
                  <div className={styles.analyzeDot} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'corrected' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('corrected')}
                >
                  <MdCheckCircle className={styles.tabIcon} />
                  <span>Corrected</span>
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'changed' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('changed')}
                >
                  <MdHistory className={styles.tabIcon} />
                  <span>What Changed</span>
                </button>
              </div>
              {showOutput && (
                <button className={styles.copyBtn}>
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
              ) : !showOutput ? (
                <div className={styles.emptyOutput}>
                  <IoGlobeOutline className={styles.emptyIcon} />
                  <div className={styles.emptyText}>Corrected output will appear here</div>
                  <div className={styles.emptySubtext}>Enter Taglish text and click Analyze</div>
                </div>
              ) : (
                <div className={styles.outputArea}>
                  {activeTab === 'corrected' ? (
                    <>
                      Kumain na <span className={styles.correction}>ako</span> kanina sa labas, tapos <span className={styles.correction}>ako ang nagedit</span> na rin ng docs. <span className={styles.correction}>Hindi</span> ko na <span className={styles.correction}>siya</span> mahanap kaya nag-message na lang ako sa kanya.
                      
                      <div className={styles.correctionHint}>
                        <MdInfoOutline />
                        <span>Tap any green word to see why it was corrected</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.diffList}>
                      {[
                        { old: 'ko', new: 'ako', cat: 'Pronoun Normalization' },
                        { old: 'nagedit ako', new: 'ako ang nagedit', cat: 'Word Order Correction' },
                        { old: 'Di', new: 'Hindi', cat: 'Informal Negation' },
                        { old: 'sya', new: 'siya', cat: 'Orthographic Correction' },
                      ].map((item, i) => (
                        <div key={i} className={styles.diffItem}>
                          <div className={styles.diffMain}>
                            <span className={styles.oldVal}>{item.old}</span>
                            <span className={styles.diffArrow}>&gt;</span>
                            <span className={styles.newVal}>{item.new}</span>
                          </div>
                          <div className={styles.diffMeta}>
                            <span className={styles.category}>{item.cat}</span>
                            <span className={styles.inspect}>Inspect →</span>
                          </div>
                        </div>
                      ))}
                      
                      <div className={styles.mixedStatus}>
                        <RiCheckboxCircleFill />
                        <span>2 mixed-language words kept as-is (nag-message, docs)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                <span className={styles.stat}>
                  {!showOutput ? 'Waiting for your text' : '4 corrections applied'}
                </span>
              </div>
              {showOutput && (
                <div className={styles.footerRight}>
                  <div className={styles.analysisStatus}>
                    <RiCheckboxCircleFill />
                    <span>Analysis Complete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
