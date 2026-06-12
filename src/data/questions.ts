import type { Question } from '../types'
import { PROVISIONAL_QUESTIONS } from './questions.provisional'
import { FULL_QUESTIONS } from './questions.full'

// 種子題庫（中日対照）。内容基于日本《道路交通法》标准知识点，题型/配分对齐官方考试。
export const QUESTIONS: Question[] = [...PROVISIONAL_QUESTIONS, ...FULL_QUESTIONS]
