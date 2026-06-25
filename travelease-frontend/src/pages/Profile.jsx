import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, KeyRound } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Spinner from '../components/common/Spinner'
import { useFetch } from '../hooks/useFetch'
import { getMyProfile, updateMyProfile, changePassword } from '../api/index'
import { getErrorMessage } from '../utils/helpers'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: profile, loading } = useFetch(getMyProfile)

  if (loading) return <Layout><Spinner /></Layout>

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center
                          justify-center text-brand-600 font-bold text-3xl">
            {profile?.fullName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xl">{profile?.fullName}</p>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            <span className="inline-block mt-1 text-xs bg-brand-50 text-brand-700
                             px-2 py-0.5 rounded-full font-medium">
              {profile?.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>

        {/* Update Profile */}
        <UpdateProfileForm profile={profile} />

        {/* Change Password */}
        <ChangePasswordForm />
      </div>
    </Layout>
  )
}

function UpdateProfileForm({ profile }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (profile) reset({ fullName: profile.fullName, phone: profile.phone || '' })
  }, [profile, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await updateMyProfile(data)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              className="input-field"
              placeholder="9876543210"
              {...register('phone')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            value={profile?.email || ''}
            disabled
            className="input-field bg-gray-50 cursor-not-allowed text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      })
      toast.success('Password changed successfully')
      reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="w-5 h-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            className={`input-field ${errors.currentPassword ? 'border-red-400' : ''}`}
            {...register('currentPassword', { required: 'Current password is required' })}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            className={`input-field ${errors.newPassword ? 'border-red-400' : ''}`}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: val => val === newPassword || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
