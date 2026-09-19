export type Member = {
  id: string
  name: string
  role: string
  company: string
  city: string
  bio: string
  specialties: string[]
  accent: string
}

export type Idea = {
  id: string
  authorId: string
  title: string
  body: string
  tags: string[]
  votes: number
  createdAt: string
}

export type Reply = {
  id: string
  ideaId: string
  authorId: string
  body: string
  createdAt: string
}

export type HotseatStatus = "live" | "upcoming" | "done"

export type Hotseat = {
  id: string
  hostId: string
  title: string
  summary: string
  startsAt: string
  durationMin: number
  seats: number
  status: HotseatStatus
  topics: string[]
}

export type HotseatQuestion = {
  id: string
  hotseatId: string
  authorId: string
  text: string
  votes: number
  createdAt: string
}

export type ProblemStatus = "open" | "in-progress" | "resolved"

export type Problem = {
  id: string
  authorId: string
  title: string
  body: string
  context: string
  tags: string[]
  status: ProblemStatus
  createdAt: string
}

export type Solution = {
  id: string
  problemId: string
  authorId: string
  body: string
  helpful: number
  createdAt: string
}

export type Meeting = {
  id: string
  title: string
  hostId: string
  guestIds: string[]
  startsAt: string
  durationMin: number
  place: string
  notes: string
}

export type Webinar = {
  id: string
  hostId: string
  title: string
  summary: string
  startsAt: string
  durationMin: number
  topics: string[]
  capacity: number
}

export type ListingKind = "service" | "trade"

export type Listing = {
  id: string
  authorId: string
  kind: ListingKind
  title: string
  description: string
  category: string
  priceCents: number | null
  tradeFor: string | null
  city: string
  createdAt: string
}

export type Inquiry = {
  id: string
  listingId: string
  authorId: string
  message: string
  createdAt: string
}

export type CommunityState = {
  ideas: Idea[]
  replies: Reply[]
  ideaVotes: string[]
  hotseats: Hotseat[]
  questions: HotseatQuestion[]
  questionVotes: string[]
  rsvps: string[]
  problems: Problem[]
  solutions: Solution[]
  solutionVotes: string[]
  meetings: Meeting[]
  webinars: Webinar[]
  listings: Listing[]
  inquiries: Inquiry[]
}
