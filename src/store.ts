import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExamResult, WrongEntry } from './types'

interface AppState {
  history: ExamResult[]
  wrong: Record<string, WrongEntry>
  showZh: boolean
  addResult: (r: ExamResult) => void
  markWrong: (questionId: string) => void
  clearWrong: (questionId: string) => void
  resetWrong: () => void
  toggleZh: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      history: [],
      wrong: {},
      showZh: true,

      addResult: (r) => set((s) => ({ history: [r, ...s.history].slice(0, 100) })),

      markWrong: (questionId) =>
        set((s) => {
          const prev = s.wrong[questionId]
          return {
            wrong: {
              ...s.wrong,
              [questionId]: {
                questionId,
                wrongCount: (prev?.wrongCount ?? 0) + 1,
                lastWrongAt: Date.now(),
              },
            },
          }
        }),

      clearWrong: (questionId) =>
        set((s) => {
          const next = { ...s.wrong }
          delete next[questionId]
          return { wrong: next }
        }),

      resetWrong: () => set({ wrong: {} }),
      toggleZh: () => set((s) => ({ showZh: !s.showZh })),
    }),
    { name: 'jp-license-store' },
  ),
)

export function selectWrongIds(wrong: Record<string, WrongEntry>): string[] {
  return Object.values(wrong)
    .sort((a, b) => b.lastWrongAt - a.lastWrongAt)
    .map((w) => w.questionId)
}
