import type { AnswerRecord, ExamResult, LicenseStage, Question } from '../types'
import { STAGE_CONFIG } from '../examConfig'

export function scoreQuestion(
  q: Question,
  userAnswer: boolean | undefined,
  subAnswers: boolean[] | undefined,
  stage: LicenseStage,
): AnswerRecord {
  const cfg = STAGE_CONFIG[stage]

  if (q.type === 'illustration' && q.subQuestions) {
    const allCorrect =
      subAnswers != null &&
      subAnswers.length === q.subQuestions.length &&
      q.subQuestions.every((sq, i) => sq.answer === subAnswers[i])
    return {
      questionId: q.id,
      subAnswers,
      correct: allCorrect,
      score: allCorrect ? cfg.illustrationScore : 0,
    }
  }

  const correct = userAnswer != null && userAnswer === q.answer
  return {
    questionId: q.id,
    userAnswer,
    correct,
    score: correct ? cfg.oxScore : 0,
  }
}

export function buildExamResult(params: {
  stage: LicenseStage
  questions: Question[]
  records: AnswerRecord[]
  startedAt: number
  finishedAt: number
}): ExamResult {
  const { stage, questions, records, startedAt, finishedAt } = params
  const cfg = STAGE_CONFIG[stage]
  const totalScore = records.reduce((s, r) => s + r.score, 0)
  const maxScore = questions.reduce(
    (s, q) => s + (q.type === 'illustration' ? cfg.illustrationScore : cfg.oxScore),
    0,
  )
  const passLine =
    maxScore === cfg.maxScore
      ? cfg.passScore
      : Math.ceil((cfg.passScore / cfg.maxScore) * maxScore)

  return {
    id: `exam_${finishedAt}`,
    stage,
    startedAt,
    finishedAt,
    durationSec: Math.round((finishedAt - startedAt) / 1000),
    totalScore,
    maxScore,
    passed: totalScore >= passLine,
    records,
  }
}
