import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ToastProvider } from './components/ui/toast'

export function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-white">
        <RouterProvider router={router} />
      </div>
    </ToastProvider>
  )
}
