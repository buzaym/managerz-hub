"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { seedState } from "@/lib/seed"
import type {
  Answer,
  CategorySlug,
  CommunityState,
  Post,
  PostKind,
  User,
} from "@/lib/types"

const STORAGE_KEY = "managerz-forum-v1"

type CommunityContextValue = CommunityState & {
  currentUser: User | null
  login: (email: string) => boolean
  signup: (input: {
    name: string
    email: string
    role: string
    company: string
    city: string
  }) => string
  logout: () => void
  loginAs: (userId: string) => void
  togglePostVote: (postId: string) => "ok" | "auth"
  toggleAnswerVote: (answerId: string) => "ok" | "auth"
  addPost: (input: {
    kind: PostKind
    title: string
    body: string
    category: CategorySlug
    startsAt?: string
  }) => string | "auth"
  addAnswer: (postId: string, body: string) => "ok" | "auth"
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

function cloneSeed(): CommunityState {
  return structuredClone(seedState)
}

const listeners = new Set<() => void>()
let memory = cloneSeed()
let loaded = false

function emit() {
  listeners.forEach((listener) => listener())
}

function persist() {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CommunityState
      memory = {
        ...cloneSeed(),
        ...parsed,
        postVotes: { ...cloneSeed().postVotes, ...parsed.postVotes },
        answerVotes: { ...cloneSeed().answerVotes, ...parsed.answerVotes },
      }
    }
  } catch {
    memory = cloneSeed()
  }
}

function subscribe(listener: () => void) {
  ensureLoaded()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  ensureLoaded()
  return memory
}

function getServerSnapshot() {
  return seedState
}

function mutate(updater: (current: CommunityState) => CommunityState) {
  memory = updater(memory)
  persist()
  emit()
}

function toggleVoteMap(
  map: Record<string, string[]>,
  id: string,
  userId: string,
) {
  const current = map[id] ?? []
  const next = current.includes(userId)
    ? current.filter((item) => item !== userId)
    : [...current, userId]
  return { ...map, [id]: next }
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const currentUser =
    state.users.find((user) => user.id === state.sessionUserId) ?? null

  const login = useCallback((email: string) => {
    const match = memory.users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!match) return false
    mutate((current) => ({ ...current, sessionUserId: match.id }))
    return true
  }, [])

  const signup = useCallback(
    (input: {
      name: string
      email: string
      role: string
      company: string
      city: string
    }) => {
      const existing = memory.users.find(
        (user) => user.email.toLowerCase() === input.email.trim().toLowerCase(),
      )
      if (existing) {
        mutate((current) => ({ ...current, sessionUserId: existing.id }))
        return existing.id
      }
      const id = `u-${crypto.randomUUID()}`
      const user: User = {
        id,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        role: input.role.trim() || "Gestor",
        company: input.company.trim() || "Independente",
        city: input.city.trim() || "Brasil",
        bio: "Acabou de entrar na Managerz.",
        accent: "oklch(0.45 0.08 250)",
      }
      mutate((current) => ({
        ...current,
        users: [user, ...current.users],
        sessionUserId: id,
      }))
      return id
    },
    [],
  )

  const logout = useCallback(() => {
    mutate((current) => ({ ...current, sessionUserId: null }))
  }, [])

  const loginAs = useCallback((userId: string) => {
    mutate((current) => ({ ...current, sessionUserId: userId }))
  }, [])

  const togglePostVote = useCallback((postId: string) => {
    const userId = memory.sessionUserId
    if (!userId) return "auth"
    mutate((current) => ({
      ...current,
      postVotes: toggleVoteMap(current.postVotes, postId, userId),
    }))
    return "ok"
  }, [])

  const toggleAnswerVote = useCallback((answerId: string) => {
    const userId = memory.sessionUserId
    if (!userId) return "auth"
    mutate((current) => ({
      ...current,
      answerVotes: toggleVoteMap(current.answerVotes, answerId, userId),
    }))
    return "ok"
  }, [])

  const addPost = useCallback(
    (input: {
      kind: PostKind
      title: string
      body: string
      category: CategorySlug
      startsAt?: string
    }) => {
      const userId = memory.sessionUserId
      if (!userId) return "auth"
      const id = `${input.kind === "hotseat" ? "hs" : "q"}-${crypto.randomUUID()}`
      const post: Post = {
        id,
        authorId: userId,
        createdAt: new Date().toISOString(),
        ...input,
      }
      mutate((current) => ({
        ...current,
        posts: [post, ...current.posts],
        postVotes: { ...current.postVotes, [id]: [userId] },
      }))
      return id
    },
    [],
  )

  const addAnswer = useCallback((postId: string, body: string) => {
    const userId = memory.sessionUserId
    if (!userId) return "auth"
    const answer: Answer = {
      id: `a-${crypto.randomUUID()}`,
      postId,
      authorId: userId,
      body,
      createdAt: new Date().toISOString(),
    }
    mutate((current) => ({
      ...current,
      answers: [...current.answers, answer],
      answerVotes: { ...current.answerVotes, [answer.id]: [] },
    }))
    return "ok"
  }, [])

  const value = useMemo<CommunityContextValue>(
    () => ({
      ...state,
      currentUser,
      login,
      signup,
      logout,
      loginAs,
      togglePostVote,
      toggleAnswerVote,
      addPost,
      addAnswer,
    }),
    [
      state,
      currentUser,
      login,
      signup,
      logout,
      loginAs,
      togglePostVote,
      toggleAnswerVote,
      addPost,
      addAnswer,
    ],
  )

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error("useCommunity precisa estar dentro de CommunityProvider")
  }
  return context
}
