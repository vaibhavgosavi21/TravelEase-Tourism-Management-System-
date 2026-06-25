import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { useFetch } from '../../hooks/useFetch'
import { getAllMessages, markMessageRead } from '../../api/index'
import { formatDate, getErrorMessage } from '../../utils/helpers'
import { MailOpen, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const { data: messages, loading, refetch } = useFetch(getAllMessages)
  const [markingId, setMarkingId]            = useState(null)
  const [expanded, setExpanded]              = useState(null)

  const handleMarkRead = async (id) => {
    setMarkingId(id)
    try {
      await markMessageRead(id)
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setMarkingId(null)
    }
  }

  const unread = (messages || []).filter(m => !m.isRead).length

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
            <p className="text-gray-500 text-sm mt-1">
              {unread > 0 && (
                <span className="text-brand-600 font-medium">{unread} unread · </span>
              )}
              {messages?.length || 0} total messages
            </p>
          </div>
        </div>

        {loading ? <Spinner /> : (
          <div className="space-y-3">
            {(messages || []).map(msg => (
              <div
                key={msg.id}
                className={`card p-5 transition-all ${
                  !msg.isRead ? 'border-l-4 border-l-brand-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                     flex-shrink-0 ${
                      !msg.isRead
                        ? 'bg-brand-100 text-brand-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {msg.isRead
                        ? <MailOpen className="w-4 h-4" />
                        : <Mail className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{msg.name}</p>
                        <p className="text-xs text-gray-400">{msg.email}</p>
                        {!msg.isRead && (
                          <span className="text-xs bg-brand-100 text-brand-700
                                           font-medium px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      {msg.subject && (
                        <p className="text-sm font-medium text-gray-700 mt-0.5">
                          {msg.subject}
                        </p>
                      )}
                      <p className={`text-sm text-gray-500 mt-1 ${
                        expanded === msg.id ? '' : 'line-clamp-2'
                      }`}>
                        {msg.message}
                      </p>
                      {msg.message.length > 120 && (
                        <button
                          onClick={() => setExpanded(
                            expanded === msg.id ? null : msg.id
                          )}
                          className="text-xs text-brand-600 mt-1 hover:underline"
                        >
                          {expanded === msg.id ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        disabled={markingId === msg.id}
                        className="text-xs text-brand-600 border border-brand-200
                                   px-3 py-1 rounded-lg hover:bg-brand-50
                                   transition-colors disabled:opacity-50"
                      >
                        {markingId === msg.id ? '...' : 'Mark read'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!messages || messages.length === 0) && (
              <div className="card p-10 text-center text-gray-400 text-sm">
                No messages yet
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
