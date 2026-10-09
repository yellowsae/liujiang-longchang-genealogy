import {
  displayLineagePath,
  peopleWithVerify,
  type Person,
} from "@/lib/genealogy"
import PersonLink from "@/components/PersonLink"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function VerifyItem({ person }: { person: Person }) {
  const path = displayLineagePath(person)
  const pathText =
    path.length <= 1 ? "本谱未载其父系归属" : path.map((x) => x.name).join(" → ")

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-center gap-2">
        <PersonLink person={person} className="font-medium" />
        <Badge variant="secondary">第 {person.generation} 代</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{pathText}</p>
      {person.verify && (
        <p className="mt-1.5 text-xs leading-relaxed text-amber-900">
          {person.verify.note}
        </p>
      )}
    </div>
  )
}

export default function VerifyPage() {
  const selfItems = peopleWithVerify().filter((p) => p.verify?.target === "self")
  const offspringItems = peopleWithVerify().filter(
    (p) => p.verify?.target === "offspring",
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif-cn text-xl font-semibold">待核清单</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          原谱照片字迹不清、或整理时存疑之处，均列于此，待与原图二次校对。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">姓名待核</CardTitle>
          <CardDescription>
            本人的名字或身份存疑，人物页上亦标注「待核」。
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border py-0">
          {selfItems.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">无</p>
          ) : (
            selfItems.map((p) => <VerifyItem key={p.id} person={p} />)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">子女待核</CardTitle>
          <CardDescription>
            本人姓名无误，但其名下子女的记载不全或未能辨认，需据原图补全。
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border py-0">
          {offspringItems.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">无</p>
          ) : (
            offspringItems.map((p) => <VerifyItem key={p.id} person={p} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
