import { useMemo, useState } from "react"
import {
  displayLineagePath,
  searchPeople,
  type Person,
} from "@/lib/genealogy"
import PersonLink from "@/components/PersonLink"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function pathText(p: Person): string {
  const path = displayLineagePath(p)
  if (path.length <= 1) return "本谱未载其父系归属"
  return path.map((x) => x.name).join(" → ")
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const results = useMemo(() => searchPeople(query), [query])
  const trimmed = query.trim()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif-cn text-xl font-semibold">搜索</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          输入姓名（或姓名中的任一字）查找本谱人物。
        </p>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="如：之、德、云"
        autoFocus
        className="max-w-sm"
      />

      {!trimmed && (
        <p className="text-sm text-muted-foreground">请输入关键字开始搜索。</p>
      )}

      {trimmed && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          未找到与「{trimmed}」匹配的人物。
        </p>
      )}

      {trimmed && results.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            共 {results.length} 条结果
          </p>
          <Card>
            <CardContent className="divide-y divide-border py-0">
              {results.map((p) => (
                <div key={p.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <PersonLink person={p} className="font-medium" />
                    <Badge variant="secondary">第 {p.generation} 代</Badge>
                    {p.isSpouseOnly && <Badge variant="muted">配偶</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pathText(p)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
