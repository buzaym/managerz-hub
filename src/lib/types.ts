export type CategorySlug =
  | "product-manager"
  | "country-manager"
  | "business-development"
  | "people"
  | "engenharia"
  | "comercial"
  | "operacoes"
  | "varejo"

export type User = {
  id: string
  name: string
  email: string
  role: string
  company: string
  city: string
  bio: string
  accent: string
}

export type PostKind = "question" | "hotseat"

export type Post = {
  id: string
  kind: PostKind
  authorId: string
  title: string
  body: string
  category: CategorySlug
  createdAt: string
  startsAt?: string
}

export type Answer = {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
}

export type CommunityState = {
  users: User[]
  sessionUserId: string | null
  posts: Post[]
  answers: Answer[]
  postVotes: Record<string, string[]>
  answerVotes: Record<string, string[]>
}

export type BadgeId = "1" | "2" | "3" | "5" | "A" | "Q" | "H" | "M" | "R" | "N"
