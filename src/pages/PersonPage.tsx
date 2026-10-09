import { Link, useParams } from "react-router-dom"
import {
  childrenOf,
  displayChildrenOf,
  generationInfo,
  getPerson,
  parentOf,
  spousesOf,
  type Person,
} from "@/lib/genealogy"
import LineagePath from "@/components/LineagePath"
import PersonLink from "@/components/PersonLink"
import VerifyMark from "@/components/VerifyMark"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function PersonList({
  people,
  emptyText,
  showGen = false,
}: {
  people: Person[]
  emptyText: string
  showGen?: boolean
}) {
  if (people.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {people.map((p) => (
        <li key={p.id}>
          <PersonLink person={p} />
          {showGen && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({p.generation})
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function PersonPage() {
  const { id } = useParams()
  const person = id ? getPerson(id) : undefined

  if (!person) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-serif-cn text-xl font-semibold">未找到该人物</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          该链接可能已失效，或此人不在本谱中。
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-primary underline underline-offset-4"
        >
          返回首页
        </Link>
      </div>
    )
  }

  const parent = parentOf(person)
  const spouses = spousesOf(person)
  const children = displayChildrenOf(person)
  const siblings = parent
    ? childrenOf(parent.id).filter((c) => c.id !== person.id)
    : []
  const genInfo = generationInfo(person.generation)

  return (
    <div className="space-y-5">
      <LineagePath person={person} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="font-serif-cn text-2xl font-semibold">
              {person.name}
            </CardTitle>
            {person.verify?.target === "self" && (
              <VerifyMark note={person.verify.note} className="ml-0 text-xs" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="secondary">第 {person.generation} 代</Badge>
            {genInfo?.char && <Badge variant="outline">{genInfo.char} 字辈</Badge>}
            <Badge variant="muted">
              {person.gender === "male" ? "男" : "女"}
            </Badge>
            {person.isSpouseOnly && <Badge variant="muted">配偶</Badge>}
          </div>
        </CardHeader>

        {person.verify && (
          <CardContent>
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <span className="font-medium">待核：</span>
              {person.verify.note}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-5 text-sm">
          {person.isSpouseOnly ? (
            <section>
              <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
                夫
              </h2>
              <div className="mt-2">
                <PersonList people={spouses} emptyText="原谱未载其夫" />
              </div>
            </section>
          ) : (
            <section>
              <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
                父
              </h2>
              <div className="mt-2">
                <PersonList
                  people={parent ? [parent] : []}
                  emptyText="原谱未载其父（或为始祖）"
                />
              </div>
            </section>
          )}

          <Separator />

          {!person.isSpouseOnly && (
            <>
              <section>
                <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
                  配偶
                </h2>
                <div className="mt-2">
                  <PersonList people={spouses} emptyText="原谱未载配偶" />
                </div>
              </section>
              <Separator />
            </>
          )}

          <section>
            <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
              子女
            </h2>
            <div className="mt-2">
              <PersonList people={children} emptyText="原谱未载子女（或其信息未能辨认）" />
            </div>
          </section>

          {!person.isSpouseOnly && siblings.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
                  同辈
                </h2>
                <div className="mt-2">
                  <PersonList people={siblings} emptyText="" />
                </div>
              </section>
            </>
          )}

          {person.notes.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className="font-serif-cn text-sm font-semibold text-muted-foreground">
                  备注
                </h2>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {person.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
