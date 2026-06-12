import type { Question } from '../types'
import { CATEGORY_LABEL } from '../types'

interface Props {
  question: Question
  showZh: boolean
  mode: 'answer' | 'review'
  userAnswer?: boolean
  userSubAnswers?: (boolean | undefined)[]
  onAnswer?: (v: boolean) => void
  onSubAnswer?: (index: number, v: boolean) => void
}

function OXButtons({
  value,
  correctAnswer,
  mode,
  onPick,
}: {
  value?: boolean
  correctAnswer: boolean
  mode: 'answer' | 'review'
  onPick?: (v: boolean) => void
}) {
  const opts: { v: boolean; label: string }[] = [
    { v: true, label: '○' },
    { v: false, label: '×' },
  ]
  return (
    <div className="flex gap-3">
      {opts.map((o) => {
        const selected = value === o.v
        let cls = 'border-slate-300 bg-white text-slate-700'
        if (mode === 'review') {
          if (o.v === correctAnswer) cls = 'border-green-500 bg-green-50 text-green-700'
          else if (selected) cls = 'border-red-500 bg-red-50 text-red-600'
          else cls = 'border-slate-200 bg-white text-slate-300'
        } else if (selected) {
          cls = 'border-brand bg-brand text-white'
        }
        return (
          <button
            key={o.label}
            disabled={mode === 'review'}
            onClick={() => onPick?.(o.v)}
            className={`flex-1 h-14 rounded-xl border-2 text-2xl font-bold transition ${cls}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function QuestionCard({
  question: q,
  showZh,
  mode,
  userAnswer,
  userSubAnswers,
  onAnswer,
  onSubAnswer,
}: Props) {
  const cat = CATEGORY_LABEL[q.category]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {cat.ja}
          {showZh && ` / ${cat.zh}`}
        </span>
        {q.type === 'illustration' && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
            図示問題
          </span>
        )}
      </div>

      <p className="font-medium leading-relaxed">{q.text_ja}</p>
      {showZh && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{q.text_zh}</p>}

      {q.type === 'illustration' && q.scenario_ja && (
        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-sm">{q.scenario_ja}</p>
          {showZh && <p className="mt-1 text-xs text-slate-500">{q.scenario_zh}</p>}
        </div>
      )}

      {q.type === 'ox' && (
        <div className="mt-4">
          <OXButtons value={userAnswer} correctAnswer={q.answer} mode={mode} onPick={onAnswer} />
          {mode === 'review' && (
            <div
              className={`mt-3 text-sm rounded-xl p-3 ${
                userAnswer === q.answer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}
            >
              <div className="font-bold mb-1">
                {userAnswer === q.answer ? '✓ 正解' : '✗ 不正解'}（正解：{q.answer ? '○' : '×'}）
              </div>
              <p>{q.explanation_ja}</p>
              {showZh && <p className="mt-1 text-slate-500">{q.explanation_zh}</p>}
            </div>
          )}
        </div>
      )}

      {q.type === 'illustration' && q.subQuestions && (
        <div className="mt-4 space-y-4">
          {q.subQuestions.map((sq, i) => {
            const val = userSubAnswers?.[i]
            return (
              <div key={i} className="border-t border-slate-100 pt-3">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-slate-400 mt-1">({i + 1})</span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{sq.text_ja}</p>
                    {showZh && (
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{sq.text_zh}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <OXButtons
                    value={val}
                    correctAnswer={sq.answer}
                    mode={mode}
                    onPick={(v) => onSubAnswer?.(i, v)}
                  />
                </div>
                {mode === 'review' && (
                  <div
                    className={`mt-2 text-xs rounded-lg p-2 ${
                      val === sq.answer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {val === sq.answer ? '✓ 正解' : '✗ 不正解'}（{sq.answer ? '○' : '×'}）：
                    {sq.explanation_ja}
                    {showZh && <span className="block text-slate-500">{sq.explanation_zh}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
