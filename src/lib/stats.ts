import type { Category, ExamResult, LicenseStage } from '../types'
import { CATEGORY_LABEL } from '../types'
import { QUESTIONS } from '../data/questions'

const CATEGORY_OF = new Map(QUESTIONS.map((q) => [q.id, q.category]))

export interface Overview {
  count: number
  passCount: number
  passRate: number // 0-100
  avgPct: number // 平均得分率 0-100
  bestPct: number // 最高得分率 0-100
  avgDurationSec: number
}

export function buildOverview(history: ExamResult[]): Overview {
  if (history.length === 0) {
    return { count: 0, passCount: 0, passRate: 0, avgPct: 0, bestPct: 0, avgDurationSec: 0 }
  }
  const pcts = history.map((h) => (h.maxScore ? (h.totalScore / h.maxScore) * 100 : 0))
  const passCount = history.filter((h) => h.passed).length
  return {
    count: history.length,
    passCount,
    passRate: Math.round((passCount / history.length) * 100),
    avgPct: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    bestPct: Math.round(Math.max(...pcts)),
    avgDurationSec: Math.round(
      history.reduce((s, h) => s + h.durationSec, 0) / history.length,
    ),
  }
}

export interface CategoryStat {
  category: Category
  label_ja: string
  label_zh: string
  total: number
  correct: number
  rate: number // 0-100
}

/** 跨所有考试记录，按知识点分类汇总答对率（图示题按整题对错计入其分类） */
export function buildCategoryStats(history: ExamResult[]): CategoryStat[] {
  const agg = new Map<Category, { total: number; correct: number }>()
  for (const exam of history) {
    for (const rec of exam.records) {
      const cat = CATEGORY_OF.get(rec.questionId)
      if (!cat) continue
      const cur = agg.get(cat) ?? { total: 0, correct: 0 }
      cur.total += 1
      if (rec.correct) cur.correct += 1
      agg.set(cat, cur)
    }
  }
  const out: CategoryStat[] = []
  for (const [category, v] of agg) {
    out.push({
      category,
      label_ja: CATEGORY_LABEL[category].ja,
      label_zh: CATEGORY_LABEL[category].zh,
      total: v.total,
      correct: v.correct,
      rate: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    })
  }
  // 正确率低的排前面（薄弱项优先）
  return out.sort((a, b) => a.rate - b.rate)
}

export interface TrendPoint {
  idx: number
  pct: number
  passed: boolean
  stage: LicenseStage
  finishedAt: number
}

/** 取最近 limit 次考试，按时间正序返回（用于趋势图） */
export function buildTrend(history: ExamResult[], limit = 10): TrendPoint[] {
  const recent = history.slice(0, limit).reverse() // history 最新在前
  return recent.map((h, i) => ({
    idx: i,
    pct: h.maxScore ? Math.round((h.totalScore / h.maxScore) * 100) : 0,
    passed: h.passed,
    stage: h.stage,
    finishedAt: h.finishedAt,
  }))
}
