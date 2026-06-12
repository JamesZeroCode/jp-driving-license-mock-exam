import { useLocation, useNavigate, Link } from 'react-router-dom'
import type { ExamResult, Question } from '../types'
import { STAGE_CONFIG } from '../examConfig'
import { useStore } from '../store'
import { QuestionCard } from '../components/QuestionCard'

interface ResultState {
  result: ExamResult
  questions: Question[]
}

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}分${s}秒`
}

export function ResultPage() {
  const loc = useLocation()
  const nav = useNavigate()
  const showZh = useStore((s) => s.showZh)
  const state = loc.state as ResultState | null

  if (!state?.result) {
    return (
      <div className="text-center space-y-3">
        <p className="text-slate-500">没有可显示的成绩数据。</p>
        <Link to="/" className="text-brand text-sm">
          返回首页
        </Link>
      </div>
    )
  }

  const { result, questions } = state
  const cfg = STAGE_CONFIG[result.stage]
  const recMap = new Map(result.records.map((r) => [r.questionId, r]))
  const pct = Math.round((result.totalScore / result.maxScore) * 100)

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl p-6 text-center text-white ${
          result.passed ? 'bg-green-600' : 'bg-red-500'
        }`}
      >
        <div className="text-sm opacity-90">{cfg.label_ja}</div>
        <div className="text-5xl font-bold my-2">{result.totalScore}</div>
        <div className="text-sm opacity-90">
          / {result.maxScore} 点（{pct}%）
        </div>
        <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/20 font-bold">
          {result.passed ? '✓ 合格 GOKAKU' : '✗ 不合格'}
        </div>
        <div className="mt-3 text-xs opacity-80">
          合格ライン {cfg.passScore}点 · 用时 {fmtDur(result.durationSec)}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => nav(`/exam/${result.stage}`)}
          className="flex-1 h-11 rounded-xl bg-brand text-white text-sm font-bold"
        >
          もう一度 / 再考一次
        </button>
        <Link
          to="/"
          className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center"
        >
          ホーム / 首页
        </Link>
      </div>

      <h3 className="text-sm font-bold text-slate-500 pt-2">解答と解説 / 答案解析</h3>
      <div className="space-y-4">
        {questions.map((q) => {
          const rec = recMap.get(q.id)
          return (
            <div key={q.id}>
              <QuestionCard
                question={q}
                showZh={showZh}
                mode="review"
                userAnswer={rec?.userAnswer}
                userSubAnswers={rec?.subAnswers}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
