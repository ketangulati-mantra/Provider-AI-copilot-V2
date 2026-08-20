import React, { useState, useRef, useEffect } from 'react'
import {
  Paperclip,
  Send,
  Mic,
  Clock,
  FileText,
  Sparkles,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react'
import './App.css'

export default function StandaloneFullChatPage({ clientName = 'Ketan', initialHistory = [] }) {
  const [messages, setMessages] = useState(
    initialHistory.length > 0
      ? initialHistory
      : [
          {
            id: 'welcome',
            type: 'welcome-banner',
            text: `Welcome to the client care conversation log for ${clientName}.`
          },
          {
            id: 'appt-1',
            type: 'appointment-card',
            title: `${clientName} requested an appointment.`,
            status: 'confirmed',
            date: '2026-06-28',
            time: '10:00 AM',
            sessionType: 'Therapy Session',
            price: '$120.00'
          },
          {
            id: 'm-1',
            type: 'text',
            sender: 'user',
            text: "Hi Dr. Ketan, I've been feeling a bit overwhelmed with work pressure this week.",
            timestamp: 'Yesterday at 4:15 PM'
          },
          {
            id: 'm-2',
            type: 'text',
            sender: 'provider',
            text: "Hello! Thank you for sharing. Remember to use the 4-7-8 breathing exercise we practiced.",
            timestamp: 'Yesterday at 4:20 PM'
          },
          {
            id: 'm-3',
            type: 'text',
            sender: 'user',
            text: "Yes, I tried it last night before sleep and it definitely helped calm down the racing thoughts.",
            timestamp: 'Today at 9:15 AM'
          }
        ]
  )

  const [inputVal, setInputVal] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputVal.trim()) return
    const newMsg = {
      id: `msg-${Date.now()}`,
      type: 'text',
      sender: 'provider',
      text: inputVal.trim(),
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, newMsg])
    setInputVal('')
  }

  return (
    <div className="ehr-fullscreen-chat-page">
      {/* Fullscreen Header */}
      <header className="ehr-fullscreen-chat-header">
        <div className="ehr-fullscreen-chat-header-left">
          <div className="avatar-wrapper">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none' }}>
              {clientName.substring(0, 1)}
            </div>
            <div className="status-indicator online" />
          </div>
          <div className="ehr-fullscreen-client-info">
            <div className="ehr-fullscreen-client-name-row">
              <h2 className="ehr-fullscreen-client-name">{clientName}</h2>
              <span className="ehr-fullscreen-badge">Active Client</span>
            </div>
            <span className="ehr-fullscreen-subtitle">Full Conversation & Inter-session History</span>
          </div>
        </div>

        <div className="ehr-fullscreen-chat-header-right">
          <button 
            type="button" 
            className="ehr-fullscreen-close-btn"
            onClick={() => window.close()}
            title="Close this tab"
          >
            Close Tab
          </button>
        </div>
      </header>

      {/* Fullscreen Chat Log */}
      <div className="ehr-fullscreen-chat-body">
        <div className="ehr-fullscreen-chat-container">
          {messages.map((item, index) => {
            if (item.type === 'welcome-banner') {
              return (
                <div key={item.id || index} className="welcome-system-banner" style={{ margin: '16px auto', maxWidth: 640 }}>
                  <p className="welcome-banner-text">{item.text}</p>
                </div>
              )
            }

            if (item.type === 'appointment-card') {
              return (
                <div key={item.id || index} className="cta-card confirmed" style={{ margin: '14px auto', maxWidth: 540 }}>
                  <div className="cta-card-header">
                    <span className="cta-card-title">{item.title}</span>
                    <span className="cta-badge success">CONFIRMED</span>
                  </div>
                  <div className="appt-details-grid">
                    <div className="appt-grid-item">
                      <span className="appt-grid-label">Date</span>
                      <span className="appt-grid-value">{item.date}</span>
                    </div>
                    <div className="appt-grid-item">
                      <span className="appt-grid-label">Time Slot</span>
                      <span className="appt-grid-value">{item.time}</span>
                    </div>
                  </div>
                </div>
              )
            }

            if (item.type === 'text') {
              const isUser = item.sender === 'user'
              return (
                <div key={item.id || index} className={`message-row ${isUser ? 'sent' : 'received'}`} style={{ maxWidth: 680, margin: '8px auto', width: '100%' }}>
                  <div className="message-bubble">
                    <p>{item.text}</p>
                  </div>
                  <span className="message-meta">{item.timestamp}</span>
                </div>
              )
            }

            return null
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fullscreen Input Bar */}
      <footer className="ehr-fullscreen-chat-footer">
        <div className="ehr-fullscreen-input-wrapper">
          <button className="attachment-trigger" title="Attach file">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            placeholder={`Message ${clientName}...`}
            className="text-input-field"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <button className="send-trigger" onClick={handleSend} disabled={!inputVal.trim()}>
            <Send size={16} />
          </button>
        </div>
      </footer>
    </div>
  )
}
