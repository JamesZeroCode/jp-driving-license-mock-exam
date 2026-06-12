import { Link, useNavigate } from 'react-router-dom'
import { STAGE_CONFIG } from '../examConfig'
import { countByStage } from '../lib/examBuilder'
import { useStore, selectWrongIds } from '../store'
import type { LicenseStage } from '../types'

function StageCard({ stage }: { stage: LicenseStage }) {
  const cfg = STAGE_CONFIG[stage]
  const c = countByStage(stage)
  const nav = useNavigate()
  const total = c.ox + c.ill
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-lg">{cfg.label_ja}</h2>
        <span className="text-xs text-slate-400">题库 {total} 题</span>
      </div>
      <p className="text-sm text-slate-500 mt-0.5">{cfg.label_zh}</p>
      <div className="mt-2 text-xs text-slate-400">
        満点 {cfg.maxScore}・合格 {cfg.passScore}点・制限 {cfg.timeLimitMin}分
        {cfg.illustrationCount > 0 && '・図示問題あり'}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => nav(`/exam/${stage}`)}
          className="h-11 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition"
        >
          模擬試験 / 模拟考
        </button>
        <button
          onClick={() => nav(`/practice/${stage}`)}
          className="h-11 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition"
        >
          練習モード / 练习
        </button>
      </div>
    </div>
  )
}

export function HomePage() {
  const wrong = useStore((s) => s.wrong)
  const history = useStore((s) => s.history)
  const wrongCount = selectWrongIds(wrong).length

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <h1 className="text-xl font-bold">日本運転免許 学科試験 模擬テスト</h1>
        <p className="text-sm text-slate-500 mt-1">日本驾照学科考试 · 中日对照模拟</p>
      </div>

      <StageCard stage="provisional" />
      <StageCard stage="full" />

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/wrong"
          className="bg-white rounded-2xl border border-slate-100 p-4 text-center hover:border-brand transition"
        >
          <div className="text-2xl">📕</div>
          <div className="text-sm font-bold mt-1">錯題本 / 错题本</div>
          <div className="text-xs text-slate-400 mt-0.5">{wrongCount} 题</div>
        </Link>
        <Link
          to="/history"
          className="bg-white rounded-2xl border border-slate-100 p-4 text-center hover:border-brand transition"
        >
          <div className="text-2xl">📊</div>
          <div className="text-sm font-bold mt-1">成績履歴 / 成绩</div>
          <div className="text-xs text-slate-400 mt-0.5">{history.length} 回</div>
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed px-1 pt-2">
        ※ 題目は日本の道路交通法に基づく学習用問題です。官方真题不公开，本题库为合规的法规知识题，
        题型与配分对齐正式考试，仅供备考练习参考。
      </p>
    </div>
  )
}
