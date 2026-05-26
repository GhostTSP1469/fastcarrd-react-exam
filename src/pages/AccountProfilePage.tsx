import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import {
  getUserProfileById,
  updateUserProfile,
  type UserProfile,
} from '../api/userProfileApi'
import { LogoutButton } from '../components/common/LogoutButton'
import { StoreLayout } from '../components/layout/StoreLayout'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { formatTokenDate, isAdminUser } from '../utils/authUser'
import { getImageUrl } from '../utils/images'

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dob: string
  image: File | null
}

const emptyProfileForm: ProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dob: '',
  image: null,
}

export function AccountProfilePage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const adminUser = isAdminUser(user)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [form, setForm] = useState(emptyProfileForm)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user?.id) {
      return
    }

    getUserProfileById(Number(user.id))
      .then((response) => {
        const nextProfile = response.data

        setProfile(nextProfile)
        setForm({
          firstName: nextProfile.firstName ?? '',
          lastName: nextProfile.lastName ?? '',
          email: nextProfile.email ?? user.email,
          phoneNumber: nextProfile.phoneNumber ?? '',
          dob: nextProfile.dob ?? '',
          image: null,
        })
      })
      .catch(() => {
        setForm((oldForm) => ({ ...oldForm, email: user.email }))
      })
  }, [user])

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  function updateAvatar(file: File | null) {
    setForm((oldForm) => ({ ...oldForm, image: file }))
    setMessage(file ? `Selected avatar: ${file.name}` : '')
  }

  async function saveProfile() {
    if (!user?.id) {
      return
    }

    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('FirstName', form.firstName)
    formData.append('LastName', form.lastName)
    formData.append('Email', form.email)
    formData.append('PhoneNumber', form.phoneNumber)
    formData.append('Dob', form.dob)
    if (form.image) {
      formData.append('Image', form.image)
    }

    try {
      const response = await updateUserProfile(formData)

      setProfile(response.data)
      setForm((oldForm) => ({ ...oldForm, image: null }))
      setMessage(response.message ?? 'Profile saved')
    } catch (error) {
      setMessage(getApiErrorMessage(error))
    }
  }

  return (
    <StoreLayout>
      <main className="mx-auto grid max-w-[1170px] grid-cols-[260px_minmax(0,1fr)] gap-10 px-6 py-20 pb-36 max-[860px]:grid-cols-1">
        <aside className="grid content-start gap-3">
          <h2 className="mt-2 font-semibold">Manage My Account</h2>
          <button className="text-left text-[#db4444]">{t('auth.profile')}</button>
          <button className="text-left text-[#777]">Address Book</button>
          <button className="text-left text-[#777]">My Payment Options</button>
          <h2 className="mt-4 font-semibold">My Orders</h2>
          <button className="text-left text-[#777]">My Returns</button>
          <button className="text-left text-[#777]">My Cancellations</button>
          <h2 className="mt-4 font-semibold">My Wishlist</h2>
        </aside>

        <section className="rounded bg-white p-8 shadow-[0_2px_22px_rgb(0_0_0_/_10%)] dark:bg-neutral-900">
          {user ? (
            <>
              <div className="mb-8 flex items-start justify-between gap-6 max-[760px]:flex-col">
                <div>
                  <span className="inline-flex min-h-8 items-center rounded-full bg-[#dcfce7] px-3 text-sm font-bold text-[#15803d]">{t('auth.authPassed')}</span>
                  <h1 className="mt-3 text-3xl font-semibold">{t('auth.profile')}</h1>
                  {message ? <p className="mt-2 text-[#db4444]">{message}</p> : null}
                </div>
                <LogoutButton text={t('nav.logout')} onClick={handleLogout} />
              </div>
              <div className="mb-8 flex items-center gap-5 max-[640px]:flex-col max-[640px]:items-start">
                <img
                  className="h-28 w-28 rounded-full bg-[#f5f5f5] object-cover dark:bg-neutral-950"
                  src={getImageUrl(profile?.image)}
                  alt={profile?.userName ?? user.name}
                />
                <div>
                  <b className="block">{profile?.userName ?? user.name}</b>
                  <span className="block text-[#777]">{profile?.image ? 'Avatar loaded from profile' : 'No avatar uploaded yet'}</span>
                  {form.image ? <small className="block text-[#777]">New file: {form.image.name}</small> : null}
                  <label className="mt-4 inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded border border-[#999] bg-white px-[26px] font-semibold dark:border-neutral-700 dark:bg-neutral-950">
                    Choose avatar
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateAvatar(event.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
                <label>
                  <span className="mb-2 block">{t('auth.name')}</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={profile?.userName ?? user.name} readOnly />
                </label>
                <label>
                  <span className="mb-2 block">Email</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={form.email} onChange={(event) => setForm((oldForm) => ({ ...oldForm, email: event.target.value }))} />
                </label>
                <label>
                  <span className="mb-2 block">First name</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={form.firstName} onChange={(event) => setForm((oldForm) => ({ ...oldForm, firstName: event.target.value }))} />
                </label>
                <label>
                  <span className="mb-2 block">Last name</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={form.lastName} onChange={(event) => setForm((oldForm) => ({ ...oldForm, lastName: event.target.value }))} />
                </label>
                <label>
                  <span className="mb-2 block">{t('auth.phone')}</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={form.phoneNumber} onChange={(event) => setForm((oldForm) => ({ ...oldForm, phoneNumber: event.target.value }))} />
                </label>
                <label>
                  <span className="mb-2 block">Date of birth</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" type="date" value={form.dob} onChange={(event) => setForm((oldForm) => ({ ...oldForm, dob: event.target.value }))} />
                </label>
                <label>
                  <span className="mb-2 block">{t('auth.role')}</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={user.roles.join(', ')} readOnly />
                </label>
                <label>
                  <span className="mb-2 block">{t('auth.tokenExpires')}</span>
                  <input className="min-h-[54px] w-full rounded border border-[#cfcfcf] bg-white px-4 outline-none dark:border-neutral-700 dark:bg-neutral-950" value={formatTokenDate(user.expiresAt)} readOnly />
                </label>
              </div>
              <div className="mt-8 flex justify-end gap-4 max-[760px]:flex-col">
                <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-950" onClick={() => navigate('/products')}>
                  {t('cart.returnToShop')}
                </button>
                {adminUser ? (
                  <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded border border-[#999] bg-white px-[34px] font-semibold dark:border-neutral-700 dark:bg-neutral-950" onClick={() => navigate('/admin')}>
                    {t('auth.adminPanel')}
                  </button>
                ) : null}
                <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" onClick={saveProfile}>
                  Save profile
                </button>
              </div>
            </>
          ) : (
            <div className="rounded bg-[#f7f7f7] p-10 text-center dark:bg-neutral-950">
              <h1 className="mb-3 text-3xl font-semibold">{t('auth.locked')}</h1>
              <p className="mb-6 text-[#777]">{t('auth.lockedText')}</p>
              <button type="button" className="inline-flex min-h-[52px] items-center justify-center rounded bg-[#db4444] px-[34px] font-semibold text-white" onClick={() => navigate('/login')}>
                {t('auth.login')}
              </button>
            </div>
          )}
        </section>
      </main>
    </StoreLayout>
  )
}
