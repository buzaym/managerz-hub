"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { currentUserId, seedState } from "@/lib/seed"
import type {
  CommunityState,
  HotseatQuestion,
  Idea,
  Inquiry,
  Listing,
  ListingKind,
  Meeting,
  Problem,
  ProblemStatus,
  Reply,
  Solution,
} from "@/lib/types"

const STORAGE_KEY = "managerz-community-v1"

type CommunityContextValue = CommunityState & {
  ready: boolean
  currentUserId: string
  addIdea: (input: { title: string; body: string; tags: string[] }) => string
  addReply: (ideaId: string, body: string) => void
  toggleIdeaVote: (ideaId: string) => void
  toggleRsvp: (eventId: string) => void
  addHotseatQuestion: (hotseatId: string, text: string) => void
  toggleQuestionVote: (questionId: string) => void
  addProblem: (input: {
    title: string
    body: string
    context: string
    tags: string[]
  }) => string
  setProblemStatus: (problemId: string, status: ProblemStatus) => void
  addSolution: (problemId: string, body: string) => void
  toggleSolutionHelpful: (solutionId: string) => void
  addMeeting: (input: {
    title: string
    guestIds: string[]
    startsAt: string
    durationMin: number
    place: string
    notes: string
  }) => string
  addListing: (input: {
    kind: ListingKind
    title: string
    description: string
    category: string
    priceCents: number | null
    tradeFor: string | null
    city: string
  }) => string
  addInquiry: (listingId: string, message: string) => void
  resetDemo: () => void
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
      memory = { ...cloneSeed(), ...JSON.parse(raw) }
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

export function CommunityProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addIdea = useCallback(
    ({ title, body, tags }: { title: string; body: string; tags: string[] }) => {
      const id = `idea-${crypto.randomUUID()}`
      const idea: Idea = {
        id,
        authorId: currentUserId,
        title,
        body,
        tags,
        votes: 1,
        createdAt: new Date().toISOString(),
      }
      mutate((current) => ({
        ...current,
        ideas: [idea, ...current.ideas],
        ideaVotes: [...current.ideaVotes, id],
      }))
      return id
    },
    [],
  )

  const addReply = useCallback((ideaId: string, body: string) => {
    const reply: Reply = {
      id: `reply-${crypto.randomUUID()}`,
      ideaId,
      authorId: currentUserId,
      body,
      createdAt: new Date().toISOString(),
    }
    mutate((current) => ({ ...current, replies: [...current.replies, reply] }))
  }, [])

  const toggleIdeaVote = useCallback((ideaId: string) => {
    mutate((current) => {
      const voted = current.ideaVotes.includes(ideaId)
      return {
        ...current,
        ideaVotes: voted
          ? current.ideaVotes.filter((id) => id !== ideaId)
          : [...current.ideaVotes, ideaId],
        ideas: current.ideas.map((idea) =>
          idea.id === ideaId
            ? { ...idea, votes: idea.votes + (voted ? -1 : 1) }
            : idea,
        ),
      }
    })
  }, [])

  const toggleRsvp = useCallback((eventId: string) => {
    mutate((current) => ({
      ...current,
      rsvps: current.rsvps.includes(eventId)
        ? current.rsvps.filter((id) => id !== eventId)
        : [...current.rsvps, eventId],
    }))
  }, [])

  const addHotseatQuestion = useCallback((hotseatId: string, text: string) => {
    const question: HotseatQuestion = {
      id: `q-${crypto.randomUUID()}`,
      hotseatId,
      authorId: currentUserId,
      text,
      votes: 1,
      createdAt: new Date().toISOString(),
    }
    mutate((current) => ({
      ...current,
      questions: [question, ...current.questions],
      questionVotes: [...current.questionVotes, question.id],
    }))
  }, [])

  const toggleQuestionVote = useCallback((questionId: string) => {
    mutate((current) => {
      const voted = current.questionVotes.includes(questionId)
      return {
        ...current,
        questionVotes: voted
          ? current.questionVotes.filter((id) => id !== questionId)
          : [...current.questionVotes, questionId],
        questions: current.questions.map((question) =>
          question.id === questionId
            ? { ...question, votes: question.votes + (voted ? -1 : 1) }
            : question,
        ),
      }
    })
  }, [])

  const addProblem = useCallback(
    ({
      title,
      body,
      context,
      tags,
    }: {
      title: string
      body: string
      context: string
      tags: string[]
    }) => {
      const id = `pb-${crypto.randomUUID()}`
      const problem: Problem = {
        id,
        authorId: currentUserId,
        title,
        body,
        context,
        tags,
        status: "open",
        createdAt: new Date().toISOString(),
      }
      mutate((current) => ({
        ...current,
        problems: [problem, ...current.problems],
      }))
      return id
    },
    [],
  )

  const setProblemStatus = useCallback(
    (problemId: string, status: ProblemStatus) => {
      mutate((current) => ({
        ...current,
        problems: current.problems.map((problem) =>
          problem.id === problemId ? { ...problem, status } : problem,
        ),
      }))
    },
    [],
  )

  const addSolution = useCallback((problemId: string, body: string) => {
    const solution: Solution = {
      id: `sol-${crypto.randomUUID()}`,
      problemId,
      authorId: currentUserId,
      body,
      helpful: 0,
      createdAt: new Date().toISOString(),
    }
    mutate((current) => ({
      ...current,
      solutions: [...current.solutions, solution],
    }))
  }, [])

  const toggleSolutionHelpful = useCallback((solutionId: string) => {
    mutate((current) => {
      const voted = current.solutionVotes.includes(solutionId)
      return {
        ...current,
        solutionVotes: voted
          ? current.solutionVotes.filter((id) => id !== solutionId)
          : [...current.solutionVotes, solutionId],
        solutions: current.solutions.map((solution) =>
          solution.id === solutionId
            ? { ...solution, helpful: solution.helpful + (voted ? -1 : 1) }
            : solution,
        ),
      }
    })
  }, [])

  const addMeeting = useCallback(
    (input: {
      title: string
      guestIds: string[]
      startsAt: string
      durationMin: number
      place: string
      notes: string
    }) => {
      const id = `mt-${crypto.randomUUID()}`
      const meeting: Meeting = {
        id,
        hostId: currentUserId,
        ...input,
      }
      mutate((current) => ({
        ...current,
        meetings: [...current.meetings, meeting],
      }))
      return id
    },
    [],
  )

  const addListing = useCallback(
    (input: {
      kind: ListingKind
      title: string
      description: string
      category: string
      priceCents: number | null
      tradeFor: string | null
      city: string
    }) => {
      const id = `ls-${crypto.randomUUID()}`
      const listing: Listing = {
        id,
        authorId: currentUserId,
        createdAt: new Date().toISOString(),
        ...input,
      }
      mutate((current) => ({
        ...current,
        listings: [listing, ...current.listings],
      }))
      return id
    },
    [],
  )

  const addInquiry = useCallback((listingId: string, message: string) => {
    const inquiry: Inquiry = {
      id: `inq-${crypto.randomUUID()}`,
      listingId,
      authorId: currentUserId,
      message,
      createdAt: new Date().toISOString(),
    }
    mutate((current) => ({
      ...current,
      inquiries: [...current.inquiries, inquiry],
    }))
  }, [])

  const resetDemo = useCallback(() => {
    memory = cloneSeed()
    persist()
    emit()
  }, [])

  const value = useMemo<CommunityContextValue>(
    () => ({
      ...state,
      ready: true,
      currentUserId,
      addIdea,
      addReply,
      toggleIdeaVote,
      toggleRsvp,
      addHotseatQuestion,
      toggleQuestionVote,
      addProblem,
      setProblemStatus,
      addSolution,
      toggleSolutionHelpful,
      addMeeting,
      addListing,
      addInquiry,
      resetDemo,
    }),
    [
      state,
      addIdea,
      addReply,
      toggleIdeaVote,
      toggleRsvp,
      addHotseatQuestion,
      toggleQuestionVote,
      addProblem,
      setProblemStatus,
      addSolution,
      toggleSolutionHelpful,
      addMeeting,
      addListing,
      addInquiry,
      resetDemo,
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
