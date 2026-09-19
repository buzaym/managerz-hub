"use client"

import { useEffect, useState } from "react"

export const MANAGER_ROLES = [
  "country",
  "business development",
  "product",
  "people",
  "engineering",
  "operations",
  "commercial",
] as const

type Phase = "typing" | "holding" | "deleting"

export function RotatingRole({
  roles = MANAGER_ROLES,
}: {
  roles?: readonly string[]
}) {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(roles[0].length)
  const [phase, setPhase] = useState<Phase>("holding")
  const [reduced, setReduced] = useState(false)

  const word = roles[index] ?? roles[0]
  const visible = reduced ? word : word.slice(0, count)

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(motion.matches)
    sync()
    motion.addEventListener("change", sync)
    return () => motion.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (reduced) {
      const id = window.setInterval(() => {
        setIndex((current) => {
          const next = (current + 1) % roles.length
          setCount(roles[next].length)
          return next
        })
        setPhase("holding")
      }, 2400)
      return () => window.clearInterval(id)
    }

    if (phase === "typing") {
      if (count >= word.length) {
        const id = window.setTimeout(() => setPhase("holding"), 0)
        return () => window.clearTimeout(id)
      }
      const id = window.setTimeout(() => setCount((current) => current + 1), 48)
      return () => window.clearTimeout(id)
    }

    if (phase === "holding") {
      const id = window.setTimeout(() => setPhase("deleting"), 2200)
      return () => window.clearTimeout(id)
    }

    if (count <= 0) {
      const id = window.setTimeout(() => {
        setIndex((current) => (current + 1) % roles.length)
        setPhase("typing")
      }, 160)
      return () => window.clearTimeout(id)
    }

    const id = window.setTimeout(() => setCount((current) => current - 1), 28)
    return () => window.clearTimeout(id)
  }, [phase, count, word, roles, reduced])

  return <span className="role-rotator">{renderFilledLetters(visible, index)}</span>
}

function renderFilledLetters(text: string, cycle: number) {
  const chunks = text.split(/(\s+)/)
  let offset = 0

  return chunks.map((chunk, chunkIndex) => {
    if (/^\s+$/.test(chunk)) {
      offset += chunk.length
      return (
        <span key={`${cycle}-space-${chunkIndex}`} className="role-space">
          {" "}
        </span>
      )
    }

    const start = offset
    offset += chunk.length

    return (
      <span key={`${cycle}-word-${chunkIndex}`} className="role-word">
        {chunk.split("").map((character, letterIndex) => (
          <span
            key={`${cycle}-letter-${start + letterIndex}`}
            className="role-letter"
          >
            {character}
          </span>
        ))}
      </span>
    )
  })
}
