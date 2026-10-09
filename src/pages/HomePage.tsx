import { Link } from "react-router-dom"
import {
  ROOT_ID,
  data,
  houses,
  meta,
  namedPeople,
  peopleWithVerify,
} from "@/lib/genealogy"
import HouseBlock from "@/components/HouseBlock"
import HouseOverview from "@/components/HouseOverview"
import PersonLink from "@/components/PersonLink"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  const unlinked = namedPeople.filter(
    (p) => p.parentId === null && p.id !== ROOT_ID,
  )
  const verifyCount = peopleWithVerify().length

  return (
    <div className="space-y-5">
      <section>
        <h1 className="font-serif-cn text-2xl font-semibold tracking-wide">
          六讲村隆昌公支系族谱
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          居 {meta.residence} · 本谱载 {namedPeople.length} 人 · 共{" "}
          {data.generations.length} 代 · 分 {houses.length} 房
        </p>
      </section>

      <HouseOverview />

      <section className="space-y-4">
        <h2 className="font-serif-cn text-lg font-semibold">分房垂丝</h2>
        {houses.map((house) => (
          <HouseBlock key={house.id} house={house} />
        ))}
      </section>

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
        <Link to="/search" className="text-primary underline underline-offset-4">
          搜索姓名
        </Link>
        可直接定位。全谱共{" "}
        <Link to="/verify" className="text-primary underline underline-offset-4">
          {verifyCount} 处待核
        </Link>
        ：原图字迹不清或尚未二次校对。
      </p>
    </div>
  )
}
