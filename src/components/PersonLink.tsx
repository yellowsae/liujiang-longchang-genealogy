import { Link } from "react-router-dom"
import type { Person } from "@/lib/genealogy"
import { cn } from "@/lib/utils"
import VerifyMark from "@/components/VerifyMark"

export default function PersonLink({
  person,
  className,
  showMark = true,
}: {
  person: Person
  className?: string
  showMark?: boolean
}) {
  const needsMark = showMark && person.verify?.target === "self"
  return (
    <Link
      to={`/person/${person.id}`}
      className={cn(
        "rounded text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline",
        person.isSpouseOnly && "text-muted-foreground",
        className,
      )}
    >
      {person.name}
      {needsMark && <VerifyMark note={person.verify?.note} />}
    </Link>
  )
}
