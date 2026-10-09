import { Link, Route, Routes } from "react-router-dom"
import Layout from "@/components/Layout"
import HomePage from "@/pages/HomePage"
import PersonPage from "@/pages/PersonPage"
import SearchPage from "@/pages/SearchPage"
import VerifyPage from "@/pages/VerifyPage"
import AboutPage from "@/pages/AboutPage"

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-serif-cn text-2xl font-semibold">未找到该页</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        链接可能已失效，或该人物不在本谱中。
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

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/person/:id" element={<PersonPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
