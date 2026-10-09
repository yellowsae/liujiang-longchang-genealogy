# 六讲村隆昌公支系族谱（电子版）

家族内部使用的电子族谱站点。数据源自《六讲村隆昌公支系族谱》照片（第 132 页）的整理稿，共 15 代、106 人，仅含姓名、父子关系与妻氏，不含生卒、字号、葬所。

站点以「房」为一级结构：首页给出房分概览与全谱世代表，主体是 5 个房块，每块以房祖起画该房的垂丝图。全谱总树被有意放弃（见 `docs/adr/0002-首页以房为一级结构.md`）。

## 技术栈

- React 18 + TypeScript + Vite
- react-router-dom（BrowserRouter，history 路由）
- Tailwind CSS v4 + shadcn/ui（Radix UI）
- 部署：Cloudflare Workers 静态资源

## 本地开发

```bash
npm install
npm run dev
```

其他命令：

```bash
npm run typecheck   # tsc --noEmit
npm run build       # typecheck + vite build
npm run preview     # 预览构建产物
```

## 部署

构建产物输出到 `dist/`，由 Cloudflare Workers 托管（配置见 `wrangler.jsonc`）。深层路径（如 `/person/:id`）由 `not_found_handling: single-page-application` 交给 `index.html` 接管。

```bash
npm run build
npx wrangler deploy
```

Worker 名称必须与 Cloudflare 上的 service 同名，否则会新建一个空 Worker。

## 目录结构

```
data/
  genealogy.json              站点数据源（schemaVersion 1）
  六讲村隆昌公支系族谱整理.md   原始整理稿
src/
  lib/genealogy.ts            数据加载、索引与查询
  pages/                      首页、人物页、检索页、待核页、关于页
  components/                 房块、垂丝图、世代表等与 ui/ 基础组件
docs/adr/                     架构决策记录
CONTEXT.md                    领域词汇表
```

## 数据说明

`data/genealogy.json` 是站点的唯一数据源，由 `src/lib/genealogy.ts` 加载并建立父子、配偶索引。

- `schemaVersion`：数据结构版本，当前为 1。
- `generations`：15 代的辈分字与标签，第 1 代与第 15 代无统一辈分字。
- `people`：人物数组，字段包括 `id`、`name`、`generation`、`gender`、`parentId`、`spouseIds`、`notes`。
- `verify`：原谱字迹不清或整理存疑的内容。`target` 为 `self`（本人姓名/世系存疑，界面在名字旁标记）或 `offspring`（子女信息未能辨认，仅列入待核清单）。

「房」以第 12 代（启字辈）为基准划分，共 5 房：启勋、启荣、启燕、启明、启章。术语定义见 `CONTEXT.md`。

本数据为第一版文字录入稿，不建议直接作为最终校订版族谱；建议用相邻页或更高清原图对「待核」内容做二次校对。

## 文档

- `CONTEXT.md`：领域词汇表（房、房祖、垂丝图、齿录、待核等）
- `docs/adr/`：架构决策记录
- `docs/agents/`：issue 追踪、triage label 与领域文档约定
