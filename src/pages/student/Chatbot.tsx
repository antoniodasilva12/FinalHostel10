import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import type { ChatMessage } from '../../lib/supabase'

const Chatbot = () => {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('student_id', profile?.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to load chat history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      // Simulate AI response (replace with actual AI integration)
      const response = await generateResponse(newMessage)

      const { error } = await supabase.from('chat_messages').insert([
        {
          student_id: profile?.id,
          message: newMessage,
          response,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error
      setNewMessage('')
      await fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const generateResponse = async (message: string): Promise<string> => {
    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple response logic (replace with actual AI integration)
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I help you today?"
    } else if (lowerMessage.includes('maintenance')) {
      return "You can submit a maintenance request through the 'Maintenance Requests' section in the sidebar."
    } else if (lowerMessage.includes('room')) {
      return "You can view your room details in the 'My Room' section. If you have any specific issues, please submit a maintenance request."
    } else if (lowerMessage.includes('payment')) {
      return "For payment-related queries, please check the payment section or contact the administration office."
    } else {
      return "I'm here to help! You can ask me about maintenance requests, room information, or general hostel policies."
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hostel Assistant</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ask me anything about the hostel, maintenance, or general information.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-[80%]">
                    {msg.message}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-[80%]">
                    {msg.response}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chatbot 