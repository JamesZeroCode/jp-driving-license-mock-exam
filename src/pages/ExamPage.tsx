import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { AnswerRecord, LicenseStage, Question } from '../types'
import { STAGE_CONFIG } from '../examConfig'
import { buildExam } from '../lib/examBuilder'
import { buildExamResult, scoreQuestion } from '../lib/scoring'
import { useStore } from '../store'
import { QuestionCard } from '../components/QuestionCard'

interface Draft {
  userAnswer?: boolean
  subAnswers?: (boolean | undefined)[]
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ExamPage() {
  const { stage } = useParams<{ stage: LicenseStage }>()
  const nav = useNavigate()
  const showZh = useStore((s) => s.showZh)
  const addResult = useStore((s) => s.addResult)
  const markWrong = useStore((s) => s.markWrong)

  const safeStage: LicenseStage = stage === 'full' ? 'full' : 'provisional'
  const cfg = STAGE_CONFIG[safeStage]

  const questions = useMemo<Question[]>(() => buildExam(safeStage), [safeStage])
  const startedAt = useRef(Date.now())
  const [idx, setIdx] = useState(0)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [elapsed, setElapsed] = useState(0)

  const limitSec = cfg.timeLimitMin * 60

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed((e) => {
        const n = e + 1
        if (n >= limitSec) submit()
        return n
      })
    }, 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const q = questions[idx]
  const draft = q ? drafts[q.id] ?? {} : {}

  function setOx(v: boolean) {
    if (!q) return
    setDrafts((d) => ({ ...d, [q.id]: { userAnswer: v } }))
  }
  function setSub(i: number, v: boolean) {
    if (!q) return
    setDrafts((d) => {
      const cur = d[q.id]?.subAnswers ?? []
      const next = [...cur]
      next[i] = v
      return { ...d, [q.id]: { subAnswers: next } }
    })
  }

  const answeredCount = questions.filter((qq) => {
    const dr = drafts[qq.id]
    if (!dr) return false
    if (qq.type === 'ox') return dr.userAnswer != null
    return (
      qq.subQuestions != null &&
      dr.subAnswers != null &&
      qq.subQuestions.every((_, i) => dr.subAnswers?.[i] != null)
    )
  }).length

  function submit() {
    const records: AnswerRecord[] = questions.map((qq) => {
      const dr = drafts[qq.id] ?? {}
      const subs = dr.subAnswers?.map((x) => x ?? false)
      const rec = scoreQuestion(qq, dr.userAnswer, subs, safeStage)
      if (!rec.correct) markWrong(qq.id)
      return rec
    })
    const result = buildExamResult({
      stage: safeStage,
      questions,
      records,
      startedAt: startedAt.current,
      finishedAt: Date.now(),
    })
    addResult(result)
    nav('/result', { state: { result, questions } })
  }

  if (!q) {
    return <p className="text-center text-slate-500">题库为空，请稍后再试。</p>
  }

  const remain = limitSec - elapsed
  const last = idx === questions.length - 1

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center justify-between text-sm">
        <span className="font-bold">{cfg.label_ja}</span>
        <span className={remain < 60 ? 'text-red-500 font-bold' : 'text-slate-500'}>
          ⏱ {fmt(remain)}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>
            第 {idx + 1} / {questions.length} 问
          </span>
          <span>已答 {answeredCount}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={q}
        showZh={showZh}
        mode="answer"
        userAnswer={draft.userAnswer}
        userSubAnswers={draft.subAnswers}
        onAnswer={setOx}
        onSubAnswer={setSub}
      />

      <div className="flex gap-3">
        <button
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-40"
        >
          ← 前へ
        </button>
        {last ? (
          <button
            onClick={submit}
            className="flex-[2] h-11 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
          >
            採点する / 交卷
          </button>
        ) : (
          <button
            onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="flex-[2] h-11 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark"
          >
            次へ →
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {questions.map((qq, i) => {
          const dr = drafts[qq.id]
          const done = dr && (dr.userAnswer != null || dr.subAnswers?.some((x) => x != null))
          return (
            <button
              key={qq.id}
              onClick={() => setIdx(i)}
              className={`w-7 h-7 rounded text-[11px] font-bold ${
                i === idx
                  ? 'bg-brand text-white'
                  : done
                    ? 'bg-brand/15 text-brand'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
