import type { CSSProperties } from "react"

export const MANAGER_ROLES = [
  "country",
  "business development",
  "product",
  "people",
  "engineering",
  "operations",
  "commercial",
] as const

export function RotatingRole({
  roles = MANAGER_ROLES,
}: {
  roles?: readonly string[]
}) {
  return (
    <span
      className="role-rotator"
      style={{ "--roles": roles.length } as CSSProperties}
    >
      {roles.map((role) => (
        <span key={role}>{role}</span>
      ))}
    </span>
  )
}
