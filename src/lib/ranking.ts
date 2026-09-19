import type { Answer, BadgeId, CommunityState, Post, User } from "@/lib/types"

export const badgeCatalog: Record<
  BadgeId,
  { glyph: string; label: string }
> = {
  "1": { glyph: "🏆1", label: "1º no ranking" },
  "2": { glyph: "🏆2", label: "2º no ranking" },
  "3": { glyph: "🏆3", label: "3º no ranking" },
  "5": { glyph: "🏆5", label: "Top 5" },
  A: { glyph: "🏆A", label: "Ace — respostas em alta" },
  Q: { glyph: "🏆Q", label: "Perguntas em alta" },
  H: { glyph: "🏆H", label: "Abre hotseat" },
  M: { glyph: "🏆M", label: "Mentor da comunidade" },
  R: { glyph: "🏆R", label: "Em alta" },
  N: { glyph: "🏆N", label: "Novo na mesa" },
}

export type UserScore = {
  user: User
  asked: number
  answered: number
  hotseats: number
  questionVotes: number
  answerVotes: number
  score: number
  rank: number
  badges: BadgeId[]
}

export function voteCount(
  map: Record<string, string[]>,
  id: string,
) {
  return map[id]?.length ?? 0
}

export function statsForUser(state: CommunityState, userId: string) {
  const askedPosts = state.posts.filter((post) => post.authorId === userId)
  const answers = state.answers.filter((answer) => answer.authorId === userId)
  const hotseats = askedPosts.filter((post) => post.kind === "hotseat")
  const questionVotes = askedPosts.reduce(
    (sum, post) => sum + voteCount(state.postVotes, post.id),
    0,
  )
  const answerVotes = answers.reduce(
    (sum, answer) => sum + voteCount(state.answerVotes, answer.id),
    0,
  )
  return {
    asked: askedPosts.length,
    answered: answers.length,
    hotseats: hotseats.length,
    questionVotes,
    answerVotes,
    score: questionVotes + answerVotes * 2,
  }
}

function pickBadges(
  stats: ReturnType<typeof statsForUser>,
  rank: number,
): BadgeId[] {
  const picked: BadgeId[] = []
  if (rank === 1) picked.push("1")
  else if (rank === 2) picked.push("2")
  else if (rank === 3) picked.push("3")
  else if (rank <= 5) picked.push("5")

  if (stats.score >= 36) picked.push("M")
  if (stats.answerVotes >= 10) picked.push("A")
  if (stats.questionVotes >= 8) picked.push("Q")
  if (stats.hotseats >= 1) picked.push("H")
  if (rank > 5 && rank <= 10 && stats.score >= 8) picked.push("R")
  if (stats.score < 6) picked.push("N")

  const unique = [...new Set(picked)]
  return unique.slice(0, 3)
}

export function rankedUsers(state: CommunityState): UserScore[] {
  const rows = state.users
    .map((user) => ({ user, ...statsForUser(state, user.id) }))
    .sort((a, b) => b.score - a.score || a.user.name.localeCompare(b.user.name))

  return rows.map((row, index) => {
    const rank = index + 1
    return { ...row, rank, badges: pickBadges(row, rank) }
  })
}

export function badgesForUser(state: CommunityState, userId: string) {
  return rankedUsers(state).find((row) => row.user.id === userId)?.badges ?? ["N"]
}

export function trendingScore(post: Post, votes: number) {
  const hours = Math.max(
    2,
    (Date.now() - new Date(post.createdAt).getTime()) / 36e5,
  )
  return votes / Math.pow(hours, 0.55)
}

export function isTrending(
  post: Post,
  posts: Post[],
  postVotes: Record<string, string[]>,
) {
  const scored = [...posts]
    .map((item) => ({
      id: item.id,
      score: trendingScore(item, voteCount(postVotes, item.id)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
  return scored.some((item) => item.id === post.id)
}

export function unanswered(post: Post, answers: Answer[]) {
  return !answers.some((answer) => answer.postId === post.id)
}
