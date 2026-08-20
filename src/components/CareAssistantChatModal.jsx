import React, { useEffect, useRef } from 'react'
import { Pill, Smile, Calendar, CreditCard, X } from 'lucide-react'

export default function CareAssistantChatModal({
  automation,
  client = { name: 'Ketan' },
  conversation = [],
  isOpen,
  onClose
}) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Position scroll around relevant automation message
    setTimeout(() => {
      if (scrollRef.current && automation) {
        const autoKey = automation.name?.toLowerCase().includes('medication')
          ? 'medication_reminder'
          : 'mood_checkin'
        const targetEl = scrollRef.current.querySelector(`#chat-modal-msg-${autoKey}`)
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 120)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, automation, onClose])

  if (!isOpen || !automation) return null

  const getIcon = (type) => {
    switch (type) {
      case 'pill':
        return <Pill size={16} className="ehr-modal-icon" />
      case 'mood':
        return <Smile size={16} className="ehr-modal-icon" />
      case 'calendar':
        return <Calendar size={16} className="ehr-modal-icon" />
      case 'billing':
        return <CreditCard size={16} className="ehr-modal-icon" />
      default:
        return <Pill size={16} className="ehr-modal-icon" />
    }
  }

  // Complete conversational dataset
  const defaultConversation = [
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello. I've analyzed this client's records. Routine check-ins and medication reminders are scheduled.",
      time: 'Yesterday · 9:00 AM'
    },
    {
      id: 'msg-2',
      sender: 'client',
      clientName: client.name || 'Ketan',
      text: "I've been feeling slightly more anxious this week, especially around evening hours.",
      time: 'Yesterday · 2:30 PM'
    },
    {
      id: 'msg-3',
      sender: 'ai',
      text: "That sounds difficult. Continuing with your prescribed routine and tracking daily mood can help us understand triggers.",
      time: 'Yesterday · 2:32 PM'
    },
    {
      id: 'msg-4',
      sender: 'care-assistant',
      automationId: 'mood_checkin',
      automationName: 'Daily Mood Check-in',
      text: "Evening Ketan! How would you rate your overall energy and mood today on a scale of 1-5?",
      time: 'Yesterday · 8:00 PM'
    },
    {
      id: 'msg-5',
      sender: 'client',
      clientName: client.name || 'Ketan',
      text: "Around 3/5. Did the deep breathing exercise and felt a bit calmer.",
      time: 'Yesterday · 8:22 PM'
    },
    {
      id: 'msg-6',
      sender: 'care-assistant',
      automationId: 'mood_checkin',
      automationName: 'Daily Mood Check-in',
      text: "That's great progress with the breathing technique. Try to get restful sleep tonight!",
      time: 'Yesterday · 8:23 PM'
    },
    {
      id: 'msg-7',
      sender: 'care-assistant',
      automationId: 'medication_reminder',
      automationName: 'Medication Reminder',
      text: "Hi Ketan, just a gentle reminder to take your prescribed Sertraline (50mg) with water this morning.",
      time: 'Today · 8:00 AM'
    },
    {
      id: 'msg-8',
      sender: 'client',
      clientName: client.name || 'Ketan',
      text: "Done, taken with breakfast.",
      time: 'Today · 8:14 AM'
    },
    {
      id: 'msg-9',
      sender: 'care-assistant',
      automationId: 'medication_reminder',
      automationName: 'Medication Reminder',
      text: "Great! Let me know if you experience any mild nausea or fatigue.",
      time: 'Today · 8:15 AM'
    },
    {
      id: 'msg-10',
      sender: 'ai',
      text: "Client medication adherence is on track (100% last 7 days). Next scheduled review in 5 days.",
      time: 'Today · 9:30 AM'
    }
  ]

  const chatMessages = conversation.length > 0 ? conversation : defaultConversation
  const targetAutoKey = automation.name?.toLowerCase().includes('medication')
    ? 'medication_reminder'
    : 'mood_checkin'

  return (
    <div className="ehr-chat-modal-backdrop animate-fadeIn" onClick={onClose}>
      <div className="ehr-chat-modal-dialog animate-scaleUp" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="ehr-chat-modal-header">
          <div className="ehr-chat-modal-title-row">
            <div className="ehr-modal-icon-wrap">
              {getIcon(automation.iconType)}
            </div>
            <div className="ehr-chat-modal-titles">
              <h2 className="ehr-modal-title">{automation.name}</h2>
              <p className="ehr-modal-subtitle">Client conversation · Today</p>
            </div>
          </div>
          <button
            type="button"
            className="ehr-modal-close-btn"
            onClick={onClose}
            aria-label="Close conversation modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="ehr-chat-modal-body" ref={scrollRef}>
          {chatMessages.map(msg => {
            const isTarget = msg.automationId === targetAutoKey

            return (
              <div
                key={msg.id}
                id={msg.automationId ? `chat-modal-msg-${msg.automationId}` : undefined}
                className={`ehr-modal-bubble-row ${msg.sender} ${isTarget ? 'is-target-highlight' : ''}`}
              >
                {msg.sender === 'care-assistant' && (
                  <div className="ehr-modal-sender-label">
                    <span>✨ Care Assistant · {msg.automationName || automation.name}</span>
                  </div>
                )}
                {msg.sender === 'client' && (
                  <div className="ehr-modal-client-label">
                    <span>{msg.clientName || client.name || 'Client'}</span>
                  </div>
                )}
                <div className="ehr-modal-bubble">
                  <div className="ehr-modal-bubble-text">{msg.text}</div>
                  <span className="ehr-modal-bubble-time">{msg.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="ehr-chat-modal-footer">
          <span className="ehr-modal-footer-note">Showing complete conversation history</span>
        </div>

      </div>
    </div>
  )
}
