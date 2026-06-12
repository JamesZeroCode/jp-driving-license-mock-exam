import { Link } from 'react-router-dom'
import { useStore, selectWrongIds } from '../store'
import { getQuestionsByIds } from '../lib/examBuilder'
import { QuestionCard } from '../components/QuestionCard'

export function WrongPage() {
  const showZh = useStore((s) => s.showZh)
  const wrong = useStore((s) => s.wrong)
  const clearWrong = useStore((s) => s.clearWrong)
  const resetWrong = useStore((s) => s.resetWrong)

  const ids = selectWrongIds(wrong)
  const questions = getQuestionsByIds(ids)

  if (questions.length === 0) {
    return (
      <div className="text-center space-y-3 py-10">
        <div className="text-4xl">🎉</div>
        <p className="text-slate-500">错题本是空的，继续保持！</p>
        <Link to="/" className="text-brand text-sm">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">錯題本 / 错题本（{questions.length}）</h2>
        <button
          onClick={() => {
            if (confirm('确定清空错题本？')) resetWrong()
          }}
          className="text-xs text-red-400 border border-red-200 rounded-full px-3 py-1"
        >
          清空
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id}>
            <QuestionCard question={q} showZh={showZh} mode="review" />
            <button
              onClick={() => clearWrong(q.id)}
              className="mt-2 w-full h-9 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold"
            >
              ✓ もう覚えた / 已掌握，移出错题本
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
