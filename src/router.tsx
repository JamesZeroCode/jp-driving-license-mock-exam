import { createHashRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ExamPage } from './pages/ExamPage'
import { ResultPage } from './pages/ResultPage'
import { PracticePage } from './pages/PracticePage'
import { WrongPage } from './pages/WrongPage'
import { HistoryPage } from './pages/HistoryPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'exam/:stage', element: <ExamPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'practice/:stage', element: <PracticePage /> },
      { path: 'wrong', element: <WrongPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
])
