import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { submitContact } from '../api/index'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await submitContact(data)
      toast.success('Message sent! We will get back to you soon.')
      reset()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Have questions about a tour package? Want to make a group booking?
              We are here to help. Reach out and we'll respond within 24 hours.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@travelease.com' },
                { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: 'Mumbai, Maharashtra, India' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl
                                  flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    placeholder="Your name"
                    className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  placeholder="How can we help?"
                  className="input-field"
                  {...register('subject')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className={`input-field ${errors.message ? 'border-red-400' : ''}`}
                  {...register('message', { required: 'Message is required' })}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
