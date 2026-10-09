import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ROOT_ID,
  data,
  meta,
  namedPeople,
  peopleWithVerify,
} from "@/lib/genealogy"
import LineageTree from "@/components/LineageTree"
import PersonLink from "@/components/PersonLink"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Mode = "default" | "all" | "none"

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("default")

  const isDefaultOpen = (depth: number) =>
    mode === "all" ? true : mode === "none" ? false : depth < 10

  const unlinked = namedPeople.filter(
    (p) => p.parentId === null && p.id !== ROOT_ID,
  )
  const verifyCount = peopleWithVerify().length

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-serif-cn text-2xl font-semibold tracking-wide">
          六讲村隆昌公支系族谱
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          居 {meta.residence} · 现有人口 {meta.population} 人 · 本谱载{" "}
          {namedPeople.length} 人 · 共 {data.generations.length} 代
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={mode === "default" ? "secondary" : "outline"}
          onClick={() => setMode("default")}
        >
          默认
        </Button>
        <Button
          size="sm"
          variant={mode === "all" ? "secondary" : "outline"}
          onClick={() => setMode("all")}
        >
          展开全部
        </Button>
        <Button
          size="sm"
          variant={mode === "none" ? "secondary" : "outline"}
          onClick={() => setMode("none")}
        >
          全部收起
        </Button>
        <Link
          to="/verify"
          className="ml-auto text-xs text-primary underline underline-offset-4"
        >
          待核 {verifyCount} 处
        </Link>
      </div>

      <Card>
        <CardContent className="pt-5">
          <LineageTree key={mode} rootId={ROOT_ID} isDefaultOpen={isDefaultOpen} />
        </CardContent>
      </Card>

      {unlinked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待定世系</CardTitle>
            <CardDescription>
              以下人物原谱未载其父系归属，暂无法挂入世系树。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {unlinked.map((p) => (
              <div key={p.id}>
                <PersonLink person={p} className="font-medium" />
                <span className="ml-2 text-xs text-muted-foreground">
                  第 {p.generation} 代
                </span>
                {p.notes.map((note) => (
                  <p key={note} className="mt-1 text-xs text-muted-foreground">
                    {note}
                  </p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        点击任一姓名进入其人物页，
        <Link
          to="/search"
          className="text-primary underline underline-offset-4"
        >
          搜索姓名
        </Link>
        可直接定位。标有「待核」者，原图字迹不清或尚未二次校对。
      </p>
    </div>
  )
}
