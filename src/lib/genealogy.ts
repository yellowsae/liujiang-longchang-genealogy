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
