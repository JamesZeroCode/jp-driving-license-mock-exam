import type { LicenseStage } from './types'

export interface StageConfig {
  stage: LicenseStage
  label_ja: string
  label_zh: string
  oxCount: number
  oxScore: number
  illustrationCount: number
  illustrationScore: number
  maxScore: number
  passScore: number
  timeLimitMin: number
}

export const STAGE_CONFIG: Record<LicenseStage, StageConfig> = {
  provisional: {
    stage: 'provisional',
    label_ja: '仮免許 学科試験',
    label_zh: '临时驾照（仮免）学科考试',
    oxCount: 50,
    oxScore: 2,
    illustrationCount: 0,
    illustrationScore: 0,
    maxScore: 100,
    passScore: 90,
    timeLimitMin: 30,
  },
  full: {
    stage: 'full',
    label_ja: '本免許 学科試験',
    label_zh: '正式驾照（本免）学科考试',
    oxCount: 90,
    oxScore: 1,
    illustrationCount: 5,
    illustrationScore: 2,
    maxScore: 100,
    passScore: 90,
    timeLimitMin: 50,
  },
}
