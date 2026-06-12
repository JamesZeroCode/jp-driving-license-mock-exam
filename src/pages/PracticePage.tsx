import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { LicenseStage, Question } from '../types'
import { buildPractice } from '../lib/examBuilder'
import { useStore } from '../store'
import { QuestionCard } from '../components/QuestionCard'

export function PracticePage() {
  const { stage } = useParams<{ stage: LicenseStage }>()
  const nav = useNavigate()
  const showZh = useStore((s) => s.showZh)
  const markWrong = useStore((s) => s.markWrong)
  const clearWrong = useStore((s) => s.clearWrong)

  const safeStage: LicenseStage = stage === 'full' ? 'full' : 'provisional'
  const questions = useMemo<Question[]>(() => buildPractice(safeStage), [safeStage])

  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [ox, setOx] = useState<boolean | undefined>()
  const [subs, setSubs] = useState<(boolean | undefined)[]>([])
  const [stat, setStat] = useState({ done: 0, correct: 0 })

  const q = questions[idx]

  function isComplete(): boolean {
    if (!q) return false
    if (q.type === 'ox') return ox != null
    return q.subQuestions != null && q.subQuestions.every((_, i) => subs[i] != null)
  }

  function check() {
    if (!q || !isComplete()) return
    let correct: boolean
    if (q.type === 'ox') {
      correct = ox === q.answer
    } else {
      correct = !!q.subQuestions?.every((sq, i) => sq.answer === subs[i])
    }
    if (correct) clearWrong(q.id)
    else markWrong(q.id)
    setStat((s) => ({ done: s.done + 1, correct: s.correct + (correct ? 1 : 0) }))
    setRevealed(true)
  }

  function next() {
    if (idx + 1 >= questions.length) {
      nav('/')
      return
    }
    setIdx((i) => i + 1)
    setRevealed(false)
    setOx(undefined)
    setSubs([])
  }

  if (!q) return <p className="text-center text-slate-500">该阶段暂无题目。</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>
          練習モード · 第 {idx + 1} / {questions.length}
        </span>
        <span>
          正解 {stat.correct} / {stat.done}
        </span>
      </div>

      <QuestionCard
        question={q}
        showZh={showZh}
        mode={revealed ? 'review' : 'answer'}
        userAnswer={ox}
        userSubAnswers={subs}
        onAnswer={setOx}
        onSubAnswer={(i, v) =>
          setSubs((prev) => {
            const n = [...prev]
            n[i] = v
            return n
          })
        }
      />

      {!revealed ? (
        <button
          disabled={!isComplete()}
          onClick={check}
          className="w-full h-12 rounded-xl bg-brand text-white font-bold disabled:opacity-40"
        >
          答え合わせ / 对答案
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full h-12 rounded-xl bg-green-600 text-white font-bold"
        >
          {idx + 1 >= questions.length ? '完成 / 结束' : '次の問題へ / 下一题'}
        </button>
      )}
    </div>
  )
}
