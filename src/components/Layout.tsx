import type { ReactNode } from "react"
import { Link, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "首页", end: true },
  { to: "/search", label: "搜索" },
  { to: "/verify", label: "待核" },
  { to: "/about", label: "关于" },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="font-serif-cn text-base font-semibold tracking-wide sm:text-lg"
          >
            <span className="sm:hidden">隆昌公支系族谱</span>
            <span className="hidden sm:inline">六讲村隆昌公支系族谱</span>
          </Link>
          <nav className="flex items-center gap-0.5 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    isActive
                      ? "bg-secondary font-medium text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-3xl space-y-1 px-4 py-6 text-xs text-muted-foreground">
          <p>本谱为家族内部电子版，请勿公开传播。</p>
          <p>依据《六讲村隆昌公支系族谱》照片（第132页）整理。</p>
        </div>
      </footer>
    </div>
  )
}
