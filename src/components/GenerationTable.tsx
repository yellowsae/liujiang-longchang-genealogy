import { generationCounts, peopleOfGeneration } from "@/lib/genealogy"
import PersonLink from "@/components/PersonLink"

export default function GenerationTable() {
  return (
    <ul className="divide-y divide-border">
      {generationCounts.map((g) => (
        <li key={g.index} className="flex gap-3 py-2.5">
          <span className="vlabel font-serif-cn text-sm text-cinnabar">
            {g.char ?? "—"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
              <span>第 {g.index} 代</span>
              <span>{g.count} 人</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
              {peopleOfGeneration(g.index).map((p) => (
                <PersonLink key={p.id} person={p} className="text-sm" />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
