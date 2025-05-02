import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export function App() {
  return (
    <div className="min-h-screen bg-white">
      <RouterProvider router={router} />
    </div>
  )
}
