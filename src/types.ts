// 日本運転免許 学科試験 数据模型
export type LicenseStage = 'provisional' | 'full'
export type QuestionType = 'ox' | 'illustration'

export type Category =
  | 'signal' | 'pass' | 'speed' | 'park' | 'cross'
  | 'safety' | 'pedestrian' | 'license' | 'emergency' | 'manner'

export const CATEGORY_LABEL: Record<Category, { ja: string; zh: string }> = {
  signal: { ja: '信号・標識', zh: '信号与标识' },
  pass: { ja: '通行方法', zh: '通行方法' },
  speed: { ja: '速度・車間距離', zh: '速度与车距' },
  park: { ja: '停車・駐車', zh: '停车与驻车' },
  cross: { ja: '交差点の通行', zh: '路口通行' },
  safety: { ja: '安全運転の知識', zh: '安全驾驶知识' },
  pedestrian: { ja: '歩行者の保護', zh: '行人保护' },
  license: { ja: '免許・車両', zh: '驾照与车辆' },
  emergency: { ja: '緊急時・故障', zh: '紧急与故障' },
  manner: { ja: '運転者の心得', zh: '驾驶人守则' },
}

export interface SubQuestion {
  text_ja: string
  text_zh: string
  answer: boolean
  explanation_ja: string
  explanation_zh: string
}

export interface Question {
  id: string
  stage: LicenseStage
  type: QuestionType
  category: Category
  text_ja: string
  text_zh: string
  answer: boolean
  explanation_ja: string
  explanation_zh: string
  scenario_ja?: string
  scenario_zh?: string
  subQuestions?: SubQuestion[]
  difficulty?: 1 | 2 | 3
}

export interface AnswerRecord {
  questionId: string
  userAnswer?: boolean
  subAnswers?: boolean[]
  correct: boolean
  score: number
}

export interface ExamResult {
  id: string
  stage: LicenseStage
  startedAt: number
  finishedAt: number
  durationSec: number
  totalScore: number
  maxScore: number
  passed: boolean
  records: AnswerRecord[]
}

export interface WrongEntry {
  questionId: string
  wrongCount: number
  lastWrongAt: number
}
