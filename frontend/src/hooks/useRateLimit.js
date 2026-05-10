/**
 * useRateLimit — Client-side rate limiting for Morphism Workspace
 *
 * Rules (final):
 *   - Max 3 analyses total per rolling 2-minute window (Session Limit).
 *   - Max 3 analyses per unique input (Per-Input Limit).
 *   - When ANY limit is hit, the button shows the "Wait M:SS" timer.
 *   - State persists across refreshes.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

const WINDOW_MS    = 2 * 60 * 1000  // 2-minute rolling window
const MAX_TOTAL     = 3              // Adjusted to 3 total analyses per window as per user feedback
const MAX_PER_INPUT = 3              // Max 3 analyses per unique input
const LS_KEY        = 'morphism_rl'

function getActive(timestamps) {
  const cutoff = Date.now() - WINDOW_MS
  return (timestamps || []).filter(t => t > cutoff)
}

function loadTimestamps() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const { windowTimestamps } = JSON.parse(raw)
    return getActive(windowTimestamps || [])
  } catch {
    return []
  }
}

function saveTimestamps(timestamps) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ windowTimestamps: timestamps }))
  } catch {
  }
}

export function formatCooldown(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function useRateLimit() {
  const [analysisCount, setAnalysisCount] = useState(0)
  const [windowTimestamps, setWindowTimestamps] = useState(() => loadTimestamps())
  const [cooldownSecs, setCooldownSecs] = useState(0)
  const timerRef = useRef(null)

  const activeTimestamps = getActive(windowTimestamps)
  const isInputLimited   = analysisCount >= MAX_PER_INPUT
  const isSessionLimited = activeTimestamps.length >= MAX_TOTAL
  const isLimited        = isInputLimited || isSessionLimited

  useEffect(() => {
    saveTimestamps(windowTimestamps)
  }, [windowTimestamps])

  // Compute seconds until the OLDEST entry in the window expires
  const computeCooldown = useCallback(() => {
    const active = getActive(windowTimestamps)
    if (active.length === 0) return 0
    const oldest = Math.min(...active)
    return Math.max(0, Math.ceil((oldest + WINDOW_MS - Date.now()) / 1000))
  }, [windowTimestamps])

  // Timer ticker — runs as long as there is at least one active entry in the window
  useEffect(() => {
    clearInterval(timerRef.current)

    if (activeTimestamps.length > 0) {
      const tick = () => {
        const secs = computeCooldown()
        setCooldownSecs(secs)
        if (secs <= 0) {
          setWindowTimestamps(prev => getActive(prev))
        }
      }
      tick()
      timerRef.current = setInterval(tick, 1000)
    } else {
      setCooldownSecs(0)
    }

    return () => clearInterval(timerRef.current)
  }, [activeTimestamps.length, computeCooldown])

  const recordAnalysis = useCallback(() => {
    setWindowTimestamps(prev => [...getActive(prev), Date.now()])
    setAnalysisCount(prev => prev + 1)
  }, [])

  const resetInput = useCallback(() => {
    setAnalysisCount(0)
  }, [])

  return {
    analysisCount,
    isInputLimited,
    isSessionLimited,
    isLimited,
    cooldownSecs,
    recordAnalysis,
    resetInput,
  }
}
