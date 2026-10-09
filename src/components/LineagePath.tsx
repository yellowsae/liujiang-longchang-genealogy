import { Fragment } from "react"
import { Link } from "react-router-dom"
import { displayLineagePath, type Person } from "@/lib/genealogy"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function LineagePath({ person }: { person: Person }) {
  const path = displayLineagePath(person)

  if (path.length <= 1) {
    return (
      <p className="text-sm text-muted-foreground">世系路径：本谱未载其父系归属</p>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((p, i) => (
          <Fragment key={p.id}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === path.length - 1 ? (
                <BreadcrumbPage>{p.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`/person/${p.id}`}>{p.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
