import { data, meta, namedPeople } from "@/lib/genealogy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="leading-relaxed">{value}</dd>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif-cn text-xl font-semibold">关于本谱</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{meta.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <Field label="资料来源" value={meta.source} />
            <Field label="居住地" value={meta.residence} />
            <Field label="现有人口" value={`${meta.population} 人`} />
            <Field label="本谱载人" value={`${namedPeople.length} 人（不含配偶）`} />
            <Field label="世代" value={`共 ${data.generations.length} 代`} />
            <Field label="世代编排" value={meta.generationNumbering} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">世代与辈分字</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
            {data.generations.map((g) => (
              <li key={g.index} className="flex items-baseline gap-2">
                <span className="w-12 shrink-0 text-muted-foreground">
                  第 {g.index} 代
                </span>
                <span className="font-serif-cn">{g.char ?? "—"}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">编纂说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {meta.sourceNote && <p>{meta.sourceNote}</p>}
          {meta.sourceNote && meta.publisherNote && <Separator />}
          {meta.publisherNote && <p>{meta.publisherNote}</p>}
          <Separator />
          <p>
            凡标注「待核」者，意为原图字迹漫漶或整理存疑，尚未与原件二次校对，
            请以原谱照片为准。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
