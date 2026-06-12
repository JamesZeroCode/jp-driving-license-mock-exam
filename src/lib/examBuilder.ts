import type { LicenseStage, Question } from '../types'
import { STAGE_CONFIG } from '../examConfig'
import { QUESTIONS } from '../data/questions'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildExam(stage: LicenseStage): Question[] {
  const cfg = STAGE_CONFIG[stage]
  const pool = QUESTIONS.filter((q) => q.stage === stage)
  const ox = shuffle(pool.filter((q) => q.type === 'ox')).slice(0, cfg.oxCount)
  if (cfg.illustrationCount > 0) {
    const ill = shuffle(pool.filter((q) => q.type === 'illustration')).slice(
      0,
      cfg.illustrationCount,
    )
    return [...ox, ...ill]
  }
  return ox
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(QUESTIONS.map((q) => [q.id, q]))
  return ids.map((id) => map.get(id)).filter((q): q is Question => q != null)
}

export function buildPractice(stage: LicenseStage, category?: string): Question[] {
  let pool = QUESTIONS.filter((q) => q.stage === stage)
  if (category) pool = pool.filter((q) => q.category === category)
  return shuffle(pool)
}

export function countByStage(stage: LicenseStage): { ox: number; ill: number } {
  const pool = QUESTIONS.filter((q) => q.stage === stage)
  return {
    ox: pool.filter((q) => q.type === 'ox').length,
    ill: pool.filter((q) => q.type === 'illustration').length,
  }
}
