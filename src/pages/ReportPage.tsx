import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { STAGE_CONFIG } from '../examConfig'
import { buildOverview, buildCategoryStats, buildTrend } from '../lib/stats'

function fmtDate(ts: number) {
  const d = new Date(ts)
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
function fmtDur(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}分${s}秒`
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
      <div className={`text-2xl font-bold ${accent ?? ''}`}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-slate-300">{sub}</div>}
    </div>
  )
}

/** 简易 SVG 柱状趋势图 */
function TrendChart({ points }: { points: ReturnType<typeof buildTrend> }) {
  if (points.length === 0) return null
  const W = 320
  const H = 120
  const padB = 18
  const n = points.length
  const bw = Math.min(28, (W - 16) / n - 6)
  const gap = (W - 16 - bw * n) / Math.max(1, n - 1 || 1)
  const passY = H - padB - (90 / 100) * (H - padB - 8)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* 合格线 90% */}
      <line x1="0" y1={passY} x2={W} y2={passY} stroke="#22c55e" strokeDasharray="4 3" strokeWidth="1" />
      <text x={W - 2} y={passY - 3} textAnchor="end" fontSize="8" fill="#22c55e">
        合格 90
      </text>
      {points.map((p, i) => {
        const h = (p.pct / 100) * (H - padB - 8)
        const x = 8 + i * (bw + gap)
        const y = H - padB - h
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} rx="3" fill={p.passed ? '#16a34a' : '#ef4444'} />
            <text x={x + bw / 2} y={y - 2} textAnchor="middle" fontSize="8" fill="#475569">
              {p.pct}
            </text>
            <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="8" fill="#94a3b8">
              {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function ReportPage() {
  const history = useStore((s) => s.history)

  if (history.length === 0) {
    return (
      <div className="text-center space-y-3 py-10">
        <div className="text-4xl">📊</div>
        <p className="text-slate-500">还没有考试记录，先去考一次吧！</p>
        <Link to="/" className="text-brand text-sm">
          返回首页
        </Link>
      </div>
    )
  }

  const ov = buildOverview(history)
  const cats = buildCategoryStats(history)
  const trend = buildTrend(history, 10)

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-lg">個人考試報表 / 个人考试报表</h2>

      {/* KPI 总览 */}
      <div className="grid grid-cols-3 gap-2">
        <KpiCard label="受験回数 / 次数" value={`${ov.count}`} />
        <KpiCard label="合格率" value={`${ov.passRate}%`} sub={`${ov.passCount}/${ov.count} 合格`} accent="text-green-600" />
        <KpiCard label="平均得分率" value={`${ov.avgPct}%`} accent={ov.avgPct >= 90 ? 'text-green-600' : 'text-slate-800'} />
        <KpiCard label="最高得分率" value={`${ov.bestPct}%`} accent="text-brand" />
        <KpiCard label="平均用时" value={fmtDur(ov.avgDurationSec)} />
        <KpiCard label="累计答题" value={`${cats.reduce((s, c) => s + c.total, 0)}`} />
      </div>

      {/* 成绩趋势 */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-bold mb-2">
          成績推移 / 成绩趋势 <span className="text-xs font-normal text-slate-400">（最近 {trend.length} 次）</span>
        </h3>
        <TrendChart points={trend} />
      </div>

      {/* 知识点掌握度 */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-bold mb-1">分野別 正答率 / 知识点掌握度</h3>
        <p className="text-[11px] text-slate-400 mb-3">正确率低的排在前面，优先复习薄弱项 👇</p>
        <div className="space-y-2.5">
          {cats.map((c) => {
            const color = c.rate >= 90 ? 'bg-green-500' : c.rate >= 70 ? 'bg-amber-400' : 'bg-red-400'
            return (
              <div key={c.category}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-slate-600">
                    {c.label_ja}
                    <span className="text-slate-400"> / {c.label_zh}</span>
                  </span>
                  <span className="font-bold text-slate-500">
                    {c.rate}%<span className="font-normal text-slate-300"> ({c.correct}/{c.total})</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${color} transition-all`} style={{ width: `${c.rate}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 每次考试明细 */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-bold mb-3">受験履歴 / 考试明细</h3>
        <div className="space-y-2">
          {history.map((h) => {
            const cfg = STAGE_CONFIG[h.stage]
            const pct = h.maxScore ? Math.round((h.totalScore / h.maxScore) * 100) : 0
            const correctCount = h.records.filter((r) => r.correct).length
            return (
              <div key={h.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                <div>
                  <div className="text-sm font-medium">{cfg.label_ja}</div>
                  <div className="text-[11px] text-slate-400">
                    {fmtDate(h.finishedAt)} · {fmtDur(h.durationSec)} · 正解 {correctCount}/{h.records.length}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {h.totalScore}
                    <span className="text-xs text-slate-400"> / {h.maxScore}</span>
                  </div>
                  <div className={`text-xs font-bold ${h.passed ? 'text-green-600' : 'text-red-500'}`}>
                    {pct}% · {h.passed ? '合格' : '不合格'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
