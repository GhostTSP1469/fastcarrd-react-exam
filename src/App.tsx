import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { getToken, getUserFromToken, isAdmin } from './utils/auth'

function ProtectedAdmin() {
  const token = getToken()
  const user = token ? getUserFromToken(token) : null

  if (!token || !isAdmin(user)) {
    return <Navigate to="/login" replace />
  }

  return <DashboardPage token={token} user={user} />
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedAdmin />} />
    </Routes>
  )
}
