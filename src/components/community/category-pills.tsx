import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/categories"
import { cn } from "@/lib/utils"

export function CategoryPills({
  active,
  className,
}: {
  active?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <Link href="/">
        <Badge variant={!active ? "default" : "outline"} className="h-6">
          Todas
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.slug} href={`/categoria/${category.slug}`}>
          <Badge
            variant={active === category.slug ? "default" : "outline"}
            className="h-6"
          >
            {category.label}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
