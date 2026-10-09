import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { childrenOf, getPerson, spousesOf, type Person } from "@/lib/genealogy"
import PersonLink from "@/components/PersonLink"

function Spouses({ person }: { person: Person }) {
  const spouses = spousesOf(person)
  if (spouses.length === 0) return null
  return (
    <span className="ml-1.5 text-xs text-muted-foreground">
      {spouses.map((s) => `妻 ${s.name}`).join(" · ")}
    </span>
  )
}

function TreeNode({
  person,
  depth,
  isDefaultOpen,
}: {
  person: Person
  depth: number
  isDefaultOpen: (depth: number) => boolean
}) {
  const children = childrenOf(person.id)
  const hasChildren = children.length > 0
  const [open, setOpen] = useState(() => isDefaultOpen(depth))

  return (
    <li>
      <div className="flex items-start py-1">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "收起" : "展开"}
            className="-ml-1 mr-0.5 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="mr-0.5 mt-0.5 size-5 shrink-0" aria-hidden="true" />
        )}

        <div className="min-w-0 pt-px">
          <PersonLink person={person} className="font-medium" />
          <Spouses person={person} />
          {hasChildren && !open && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              其后 {children.length} 人
            </span>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <ul className="ml-2.5 border-l border-border pl-2.5 sm:ml-3 sm:pl-3.5">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              person={child}
              depth={depth + 1}
              isDefaultOpen={isDefaultOpen}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function LineageTree({
  rootId,
  isDefaultOpen,
}: {
  rootId: string
  isDefaultOpen: (depth: number) => boolean
}) {
  const root = getPerson(rootId)
  if (!root) return null
  return (
    <ul className="text-sm">
      <TreeNode person={root} depth={0} isDefaultOpen={isDefaultOpen} />
    </ul>
  )
}
