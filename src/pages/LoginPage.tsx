import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api/adminApi'
import logotipe from '../assets/logotipe.png'
import { getUserFromToken, isAdmin, saveToken } from '../utils/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitLogin(event: { preventDefault: () => void }) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginAdmin(email, password)
      const user = getUserFromToken(response.data)

      if (!isAdmin(user)) {
        setError('This account has no admin access')
        return
      }

      saveToken(response.data)
      navigate('/dashboard')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand">
        <div>
          <p>Welcome to admin panel</p>
          <div className="admin-login-logo">
            <img src={logotipe} alt="fastcart" />
            <span>fastcart</span>
          </div>
        </div>
      </section>

      <section className="admin-login-form-side">
        <form className="admin-login-form" onSubmit={submitLogin}>
          <h1>Log in</h1>
          <label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="username"
              required
            />
          </label>
          <label className="admin-password-field">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </label>
          <button className="admin-forgot-button" type="button">
            Forgot password?
          </button>
          <button className="admin-login-button" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Log in'}
          </button>
          {error ? <p className="admin-login-error">{error}</p> : null}
        </form>
      </section>
    </main>
  )
}
