import { ChevronDown } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import GenerationTable from "@/components/GenerationTable"
import { generationCounts, houses } from "@/lib/genealogy"

function scrollToHouse(id: string) {
  document
    .getElementById(`house-${id}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function Bar({ ratio }: { ratio: number }) {
  return (
    <span className="h-2 flex-1 overflow-hidden rounded-sm bg-secondary">
      <span
        className="block h-full rounded-sm bg-cinnabar/70"
        style={{ width: `${Math.max(ratio * 100, 3)}%` }}
      />
    </span>
  )
}

export default function HouseOverview() {
  const maxHouse = Math.max(...houses.map((h) => h.size))
  const maxGeneration = Math.max(...generationCounts.map((g) => g.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">全谱概览</CardTitle>
        <CardDescription>按房、按世代两种切法看全谱。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <section>
          <h3 className="text-xs font-medium text-muted-foreground">房分</h3>
          <ul className="mt-2.5 space-y-2">
            {houses.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => scrollToHouse(h.id)}
                  className="group flex w-full items-center gap-2 text-left"
                >
                  <span className="w-14 shrink-0 font-serif-cn text-sm group-hover:text-primary">
                    {h.name}
                  </span>
                  <Bar ratio={h.size / maxHouse} />
                  <span className="w-11 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {h.size} 人
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-medium text-muted-foreground">
            世代分布
          </h3>
          <ul className="mt-2.5 space-y-1.5">
            {generationCounts.map((g) => (
              <li key={g.index} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-xs text-muted-foreground">
                  第 {g.index} 代
                </span>
                <Bar ratio={g.count / maxGeneration} />
                <span className="w-11 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {g.count} 人
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Collapsible>
          <CollapsibleTrigger className="group flex w-full items-center gap-1.5 rounded text-xs text-muted-foreground transition-colors hover:text-foreground">
            <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            全谱世代表（按世代列名）
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <GenerationTable />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
