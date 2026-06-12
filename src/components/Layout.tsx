import { Link, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../store'

export function Layout() {
  const showZh = useStore((s) => s.showZh)
  const toggleZh = useStore((s) => s.toggleZh)
  const loc = useLocation()
  const isHome = loc.pathname === '/'

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-brand">
            <span className="text-xl">🚗</span>
            <span className="text-sm leading-tight">
              運転免許 学科試験
              <span className="block text-[10px] font-normal text-slate-400">
                日本驾照学科模拟考试
              </span>
            </span>
          </Link>
          <button
            onClick={toggleZh}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              showZh
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-slate-500 border-slate-300'
            }`}
          >
            {showZh ? '中日対照 ON' : '中日対照 OFF'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5">
        <Outlet />
      </main>

      {!isHome && (
        <footer className="max-w-2xl w-full mx-auto px-4 py-4 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-brand">
            ← ホームに戻る / 返回首页
          </Link>
        </footer>
      )}
    </div>
  )
}
