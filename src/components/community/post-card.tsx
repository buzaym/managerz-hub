"use client"

import Link from "next/link"

import { MemberAvatar } from "@/components/people/member-avatar"
import { ShareButton } from "@/components/community/share-button"
import { UserBadges } from "@/components/community/user-badges"
import { VoteControl } from "@/components/community/vote-control"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCategory } from "@/lib/categories"
import { useCommunity } from "@/lib/community-store"
import { formatDate } from "@/lib/format"
import {
  badgesForUser,
  isTrending,
  voteCount,
} from "@/lib/ranking"
import type { Post } from "@/lib/types"

export function PostCard({ post }: { post: Post }) {
  const {
    users,
    answers,
    postVotes,
    answerVotes,
    posts,
    sessionUserId,
    togglePostVote,
  } = useCommunity()
  const author = users.find((user) => user.id === post.authorId) ?? users[0]
  const votes = voteCount(postVotes, post.id)
  const replyCount = answers.filter((answer) => answer.postId === post.id).length
  const trending = isTrending(post, posts, postVotes)
  const category = getCategory(post.category)
  const badges = badgesForUser(
    { users, sessionUserId, posts, answers, postVotes, answerVotes },
    author.id,
  )
  const voted = (postVotes[post.id] ?? []).includes(sessionUserId ?? "")

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start gap-3">
        <VoteControl
          count={votes}
          active={voted}
          onToggle={() => togglePostVote(post.id)}
          label={`Votar em ${post.title}`}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {trending ? <Badge>Em alta</Badge> : null}
            {post.kind === "hotseat" ? (
              <Badge variant="secondary">Hotseat</Badge>
            ) : null}
            <Badge variant="outline">{category?.label}</Badge>
          </div>
          <CardTitle className="text-base leading-snug sm:text-lg">
            <Link href={`/q/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.body}
          </p>
        </div>
      </CardHeader>
      <CardFooter className="justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <MemberAvatar member={author} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{author.name}</p>
              <UserBadges badges={badges.slice(0, 2)} />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {author.role} · {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {replyCount} {replyCount === 1 ? "resposta" : "respostas"}
          </span>
          <ShareButton title={post.title} path={`/q/${post.id}`} />
        </div>
      </CardFooter>
    </Card>
  )
}
