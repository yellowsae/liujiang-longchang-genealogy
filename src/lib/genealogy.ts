import rawData from "../../data/genealogy.json"

export type Gender = "male" | "female"
export type VerifyTarget = "self" | "offspring"

export interface Verify {
  target: VerifyTarget
  note: string
}

export interface Person {
  id: string
  name: string
  generation: number
  gender: Gender
  parentId: string | null
  spouseIds: string[]
  notes: string[]
  verify?: Verify
  isSpouseOnly?: boolean
}

export interface GenerationInfo {
  index: number
  char: string | null
  label?: string
}

export interface GenealogyMeta {
  title: string
  source: string
  residence: string
  population: number
  generationNumbering: string
  sourceNote: string
  publisherNote: string
  verifyField: string
}

export interface GenealogyData {
  schemaVersion: number
  meta: GenealogyMeta
  generations: GenerationInfo[]
  people: Person[]
}

export const data = rawData as unknown as GenealogyData
export const meta = data.meta

const byId = new Map<string, Person>(data.people.map((p) => [p.id, p]))

const childrenIndex = new Map<string, Person[]>()
for (const p of data.people) {
  if (p.parentId) {
    const list = childrenIndex.get(p.parentId)
    if (list) list.push(p)
    else childrenIndex.set(p.parentId, [p])
  }
}

export const ROOT_ID = "longchang"

export function getPerson(id: string): Person | undefined {
  return byId.get(id)
}

export function parentOf(p: Person): Person | undefined {
  return p.parentId ? byId.get(p.parentId) : undefined
}

export function childrenOf(id: string): Person[] {
  return childrenIndex.get(id) ?? []
}

export function spousesOf(p: Person): Person[] {
  return p.spouseIds
    .map((id) => byId.get(id))
    .filter((s): s is Person => s !== undefined)
}

/** 展示用子女：配偶节点本身不挂子女，取其配偶（夫）的子女 */
export function displayChildrenOf(p: Person): Person[] {
  if (p.isSpouseOnly) {
    const spouse = spousesOf(p)[0]
    return spouse ? childrenOf(spouse.id) : []
  }
  return childrenOf(p.id)
}

/** 自本人上溯至始祖的世系路径（含本人） */
export function lineagePath(id: string): Person[] {
  const path: Person[] = []
  let cur = byId.get(id)
  let guard = 0
  while (cur && guard++ < 100) {
    path.unshift(cur)
    cur = cur.parentId ? byId.get(cur.parentId) : undefined
  }
  return path
}

/** 展示用世系路径：配偶节点经由其夫上溯 */
export function displayLineagePath(p: Person): Person[] {
  if (!p.isSpouseOnly) return lineagePath(p.id)
  const husband = spousesOf(p)[0]
  if (!husband) return [p]
  return [...lineagePath(husband.id), p]
}

export function generationInfo(index: number): GenerationInfo | undefined {
  return data.generations.find((g) => g.index === index)
}

export function generationLabel(index: number): string {
  return `第 ${index} 代`
}

export function searchPeople(query: string): Person[] {
  const q = query.trim()
  if (!q) return []
  return data.people.filter((p) => p.name.includes(q))
}

export function peopleWithVerify(): Person[] {
  return data.people.filter((p) => p.verify)
}

export const namedPeople = data.people.filter((p) => !p.isSpouseOnly)

/** 分房基准世代：第 12 代启字辈 */
export const HOUSE_GENERATION = 12

export interface House {
  /** 房祖 id */
  id: string
  /** 房名，如「启勋房」 */
  name: string
  ancestor: Person
  /** 房内具名人数（不含配偶） */
  size: number
  genFrom: number
  genTo: number
  /** 房内待核处数 */
  verifyCount: number
  /** 房祖上溯至始祖的路径（含两端） */
  lineage: Person[]
}

const descendantCache = new Map<string, Person[]>()

/** 全部具名后裔（不含本人） */
export function descendantsOf(id: string): Person[] {
  const cached = descendantCache.get(id)
  if (cached) return cached
  const out: Person[] = []
  for (const child of childrenOf(id)) {
    out.push(child, ...descendantsOf(child.id))
  }
  descendantCache.set(id, out)
  return out
}

export function membersOfHouse(ancestor: Person): Person[] {
  return [ancestor, ...descendantsOf(ancestor.id)]
}

/** 全谱五房，按人口降序 */
export const houses: House[] = namedPeople
  .filter((p) => p.generation === HOUSE_GENERATION)
  .map((ancestor) => {
    const members = membersOfHouse(ancestor)
    const gens = members.map((m) => m.generation)
    return {
      id: ancestor.id,
      name: `${ancestor.name}房`,
      ancestor,
      size: members.length,
      genFrom: Math.min(...gens),
      genTo: Math.max(...gens),
      verifyCount: members.filter((m) => m.verify).length,
      lineage: lineagePath(ancestor.id),
    }
  })
  .sort((a, b) => b.size - a.size)

/** 某人所属的房；配偶经其夫归属 */
export function houseOf(person: Person): House | undefined {
  const start = person.isSpouseOnly ? spousesOf(person)[0] : person
  if (!start) return undefined
  let cur: Person | undefined = start
  let guard = 0
  while (cur && guard++ < 100) {
    if (cur.generation === HOUSE_GENERATION) {
      const id = cur.id
      return houses.find((h) => h.id === id)
    }
    cur = parentOf(cur)
  }
  return undefined
}

export interface GenerationCount {
  index: number
  char: string | null
  count: number
}

export const generationCounts: GenerationCount[] = data.generations.map((g) => ({
  index: g.index,
  char: g.char,
  count: namedPeople.filter((p) => p.generation === g.index).length,
}))

export function peopleOfGeneration(index: number): Person[] {
  return namedPeople.filter((p) => p.generation === index)
}
