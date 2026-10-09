import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import LineageTree from "@/components/LineageTree"
import PersonLink from "@/components/PersonLink"
import type { House, Person } from "@/lib/genealogy"

type TrailNode =
  | { kind: "person"; person: Person }
  | { kind: "gap"; title: string }

function LineageTrail({ path }: { path: Person[] }) {
  const full = path.map((p) => p.name).join(" → ")
  const nodes: TrailNode[] =
    path.length > 6
      ? [
          { kind: "person", person: path[0] },
          { kind: "person", person: path[1] },
          { kind: "gap", title: full },
          { kind: "person", person: path[path.length - 2] },
          { kind: "person", person: path[path.length - 1] },
        ]
      : path.map((person) => ({ kind: "person" as const, person }))

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-muted-foreground">
      {nodes.map((node, i) => (
        <span key={`${i}-${node.kind}`} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-border">
              ›
            </span>
          )}
          {node.kind === "gap" ? (
            <span title={node.title} className="cursor-help tracking-widest">
              ……
            </span>
          ) : i === nodes.length - 1 ? (
            <span className="font-medium text-foreground">
              {node.person.name}
            </span>
          ) : (
            <PersonLink person={node.person} showMark={false} />
          )}
        </span>
      ))}
    </div>
  )
}

export default function HouseBlock({ house }: { house: House }) {
  return (
    <Card id={`house-${house.id}`} className="scroll-mt-16">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="seal text-sm">{house.name}</span>
          <span className="text-xs text-muted-foreground">
            {house.size} 人
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            第 {house.genFrom}
            {house.genTo > house.genFrom ? `–${house.genTo}` : ""} 代
          </span>
        </div>
        <LineageTrail path={house.lineage} />
        {house.verifyCount > 0 && (
          <Link
            to="/verify"
            className="w-fit rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-800 transition-colors hover:bg-amber-100"
          >
            房内 {house.verifyCount} 处待核
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <LineageTree
          rootId={house.ancestor.id}
          isDefaultOpen={(depth) => depth < 1}
        />
      </CardContent>
    </Card>
  )
}
