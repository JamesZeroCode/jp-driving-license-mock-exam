import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { STAGE_CONFIG } from '../examConfig'

function fmtDate(ts: number) {
  const d = new Date(ts)
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export function HistoryPage() {
  const history = useStore((s) => s.history)

  if (history.length === 0) {
    return (
      <div className="text-center space-y-3 py-10">
        <div className="text-4xl">📊</div>
        <p className="text-slate-500">还没有考试记录，去考一次吧！</p>
        <Link to="/" className="text-brand text-sm">
          返回首页
        </Link>
      </div>
    )
  }

  const passCount = history.filter((h) => h.passed).length

  return (
    <div className="space-y-4">
      <h2 className="font-bold">成績履歴 / 成绩记录</h2>
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex justify-around text-center">
        <div>
          <div className="text-2xl font-bold">{history.length}</div>
          <div className="text-xs text-slate-400">受験回数</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{passCount}</div>
          <div className="text-xs text-slate-400">合格</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {Math.round((passCount / history.length) * 100)}%
          </div>
          <div className="text-xs text-slate-400">合格率</div>
        </div>
      </div>

      <div className="space-y-2">
        {history.map((h) => {
          const cfg = STAGE_CONFIG[h.stage]
          return (
            <div
              key={h.id}
              className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">{cfg.label_ja}</div>
                <div className="text-xs text-slate-400">{fmtDate(h.finishedAt)}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {h.totalScore}
                  <span className="text-xs text-slate-400"> / {h.maxScore}</span>
                </div>
                <div
                  className={`text-xs font-bold ${h.passed ? 'text-green-600' : 'text-red-500'}`}
                >
                  {h.passed ? '合格' : '不合格'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
