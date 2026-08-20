import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  Pill,
  Smile,
  Calendar,
  CreditCard,
  Activity,
  CheckSquare,
  FileText,
  Eye,
  Heart,
  Moon,
  Wind,
  Sparkles,
  BookOpen,
  Coffee,
  ShieldAlert,
  Zap,
  Target,
  HelpCircle,
  Check,
  RotateCcw
} from 'lucide-react'
import CareAssistantChatModal from './components/CareAssistantChatModal'

export const DEFAULT_AUTOMATIONS = [
  {
    id: 1,
    name: 'Medication Reminder',
    purpose: 'Help client stay consistent with medication schedule.',
    description: 'Prompts client on prescribed doses and notes timing adherence between psychiatric reviews.',
    status: 'Active',
    frequency: 'Daily · 8:00 AM',
    schedule: 'Daily · 8:00 AM',
    iconType: 'pill'
  },
  {
    id: 2,
    name: 'Daily Mood Check-in',
    purpose: 'Check in about mood and well-being between sessions.',
    description: 'Collects 1-5 emotional scores and notes somatic calm or anxiety spikes between visits.',
    status: 'Active',
    frequency: 'Every evening · 8:00 PM',
    schedule: 'Every evening · 8:00 PM',
    iconType: 'mood'
  },
  {
    id: 3,
    name: 'Session Reminder',
    purpose: 'Send appointment notification before upcoming sessions.',
    description: 'Delivers appointment prep and telehealth room link 24 hours ahead to reduce no-shows.',
    status: 'Off',
    frequency: '24 hours before appointment',
    schedule: '24 hours before appointment',
    iconType: 'calendar'
  },
  {
    id: 4,
    name: 'Payment & Renewal Reminder',
    purpose: 'Notify client before upcoming package renewal or invoice due date.',
    description: 'Sends advance notice before subscription renewal or credit expiry to avoid care disruption.',
    status: 'Off',
    frequency: '3 days before renewal',
    schedule: '3 days before renewal',
    iconType: 'billing'
  },
  {
    id: 5,
    name: 'CBT Thought Log & Journaling',
    purpose: 'Prompt client to log automatic thoughts and complete cognitive restructuring.',
    description: 'Prompts client to identify cognitive distortions and log structured thought records.',
    status: 'Off',
    frequency: 'Every 2 days · 6:00 PM',
    schedule: 'Every 2 days · 6:00 PM',
    iconType: 'homework'
  },
  {
    id: 6,
    name: 'Weekly Clinical Screening (PHQ-9 / GAD-7)',
    purpose: 'Send standard depression and anxiety assessments before weekly review.',
    description: 'Administers interactive symptom screeners and calculates objective progress scores.',
    status: 'Off',
    frequency: 'Weekly on Friday · 10:00 AM',
    schedule: 'Weekly on Friday · 10:00 AM',
    iconType: 'assessment'
  },
  {
    id: 7,
    name: 'Sleep Hygiene & Rest Tracker',
    purpose: 'Track sleep hours, bedtime consistency, and nighttime awakenings.',
    description: 'Checks daily sleep duration, latency, and nighttime awakenings for insomnia tracking.',
    status: 'Off',
    frequency: 'Daily · 9:00 AM',
    schedule: 'Daily · 9:00 AM',
    iconType: 'sleep'
  },
  {
    id: 8,
    name: 'Mindfulness & Breathing Exercise',
    purpose: 'Send guided diaphragmatic or box breathing prompt for somatic calm.',
    description: 'Sends a 3-minute guided breathing reset to regulate autonomic panic and work tension.',
    status: 'Off',
    frequency: 'Daily · 2:00 PM',
    schedule: 'Daily · 2:00 PM',
    iconType: 'breath'
  },
  {
    id: 9,
    name: 'Exposure Therapy Practice Check',
    purpose: 'Encourage client to practice agreed hierarchy exposure exercises.',
    description: 'Prompts agreed ERP exposure practice and records Subjective Units of Distress (SUDS).',
    status: 'Off',
    frequency: 'Every 3 days · 4:00 PM',
    schedule: 'Every 3 days · 4:00 PM',
    iconType: 'target'
  },
  {
    id: 10,
    name: 'Gratitude & Wins Reflection',
    purpose: 'Encourage positive psychology focus by listing 3 wins or positive moments.',
    description: 'Invites positive reappraisal and counters rumination by recording 3 positive wins.',
    status: 'Off',
    frequency: 'Weekly on Sunday · 7:00 PM',
    schedule: 'Weekly on Sunday · 7:00 PM',
    iconType: 'heart'
  },
  {
    id: 11,
    name: 'Post-Session Takeaways Summary',
    purpose: 'Prompt client to review key takeaways and goals from the last appointment.',
    description: 'Captures key commitments and therapy takeaways the morning following an appointment.',
    status: 'Off',
    frequency: 'Morning after session · 10:00 AM',
    schedule: 'Morning after session · 10:00 AM',
    iconType: 'book'
  },
  {
    id: 12,
    name: 'Hydration & Nutrition Check-in',
    purpose: 'Gentle wellness check for basic somatic self-care adherence.',
    description: 'Midday check on baseline physiological health: meals, hydration, and movement breaks.',
    status: 'Off',
    frequency: 'Daily · 1:00 PM',
    schedule: 'Daily · 1:00 PM',
    iconType: 'coffee'
  },
  {
    id: 13,
    name: 'Relapse Prevention & Crisis Coping Plan',
    purpose: 'Check-in on trigger awareness and remind client of agreed emergency contacts.',
    description: 'Confirms trigger awareness and verifies access to personalized crisis coping steps.',
    status: 'Off',
    frequency: 'Bi-weekly on Monday · 11:00 AM',
    schedule: 'Bi-weekly on Monday · 11:00 AM',
    iconType: 'shield'
  },
  {
    id: 14,
    name: 'Behavioral Activation & Activity Scheduling',
    purpose: 'Encourage participation in scheduled pleasant or mastery activities.',
    description: 'Checks in on planned mastery or pleasant activities to counter depressive inertia.',
    status: 'Off',
    frequency: 'Every 2 days · 11:00 AM',
    schedule: 'Every 2 days · 11:00 AM',
    iconType: 'zap'
  }
]

export default function CareAssistant({
  automations = DEFAULT_AUTOMATIONS,
  onUpdateAutomation,
  onToggleStatus,
  globalEnabled = true,
  onToggleGlobal
}) {
  const [editingId, setEditingId] = useState(null)
  const [enablingId, setEnablingId] = useState(null)

  // In-Context Chat Modal State
  const [selectedChatAuto, setSelectedChatAuto] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Configure states
  const [configFreq, setConfigFreq] = useState('Every day')
  const [configTime, setConfigTime] = useState('8:00 AM')

  // Enable states
  const [enableTiming, setEnableTiming] = useState('24 hours before appointment')

  // Subtle React-Hot-Toast Helper on Right Side (Replaces previous toast, no nesting/stacking)
  const triggerToast = (title, subtitle = null) => {
    toast.dismiss()
    toast.custom(
      (t) => (
        <div
          className={`ehr-subtle-right-toast ${t.visible ? 'is-visible' : 'is-hidden'}`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="ehr-right-toast-indicator" />
          <div className="ehr-right-toast-body">
            <span className="ehr-right-toast-title">{title}</span>
            {subtitle && <span className="ehr-right-toast-sub">{subtitle}</span>}
          </div>
        </div>
      ),
      {
        id: 'ca-action-toast',
        duration: 3000,
        position: 'top-right'
      }
    )
  }

  // Merge full 14 options
  const currentAutomations = DEFAULT_AUTOMATIONS.map(def => {
    const found = (automations || []).find(a => a.id === def.id || a.name === def.name)
    if (!found) return def
    return {
      ...def,
      ...found,
      description: def.description,
      purpose: def.purpose
    }
  })

  const activeAutomations = currentAutomations.filter(a => a.status === 'Active' || a.status === 'Paused')
  const availableAutomations = currentAutomations.filter(a => a.status === 'Off' || !a.status)
  const activeCount = currentAutomations.filter(a => a.status === 'Active').length

  const getIcon = (type) => {
    switch (type) {
      case 'pill':
        return <Pill size={15} className="ehr-icon" />
      case 'mood':
        return <Smile size={15} className="ehr-icon" />
      case 'calendar':
        return <Calendar size={15} className="ehr-icon" />
      case 'billing':
        return <CreditCard size={15} className="ehr-icon" />
      case 'homework':
        return <CheckSquare size={15} className="ehr-icon" />
      case 'assessment':
        return <Activity size={15} className="ehr-icon" />
      case 'sleep':
        return <Moon size={15} className="ehr-icon" />
      case 'breath':
        return <Wind size={15} className="ehr-icon" />
      case 'target':
        return <Target size={15} className="ehr-icon" />
      case 'heart':
        return <Heart size={15} className="ehr-icon" />
      case 'book':
        return <BookOpen size={15} className="ehr-icon" />
      case 'coffee':
        return <Coffee size={15} className="ehr-icon" />
      case 'shield':
        return <ShieldAlert size={15} className="ehr-icon" />
      case 'zap':
        return <Zap size={15} className="ehr-icon" />
      default:
        return <Sparkles size={15} className="ehr-icon" />
    }
  }

  const handleToggleGlobal = () => {
    const newState = !globalEnabled
    if (onToggleGlobal) onToggleGlobal(newState)

    if (!newState) {
      triggerToast('Care Assistant turned off', 'Automated follow-ups paused')
    } else {
      triggerToast('Care Assistant enabled', 'Active follow-ups resumed')
    }
  }

  const handleOpenChatModal = (auto) => {
    setSelectedChatAuto(auto)
    setIsChatModalOpen(true)
  }

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedChatAuto(null)
  }

  const handleStartEdit = (auto) => {
    setEditingId(auto.id)
    setEnablingId(null)
    if (auto.frequency?.includes('evening') || auto.frequency?.includes('8:00 PM')) {
      setConfigFreq('Every evening')
      setConfigTime('8:00 PM')
    } else if (auto.frequency?.includes('Daily') || auto.frequency?.includes('8:00 AM') || auto.frequency?.includes('Every day')) {
      setConfigFreq('Every day')
      setConfigTime('8:00 AM')
    } else {
      setConfigFreq('Every day')
      setConfigTime('9:00 AM')
    }
  }

  const handleSaveEdit = (auto) => {
    const computed = `${configFreq} · ${configTime}`
    const updated = {
      ...auto,
      frequency: computed,
      schedule: computed
    }
    if (onUpdateAutomation) {
      onUpdateAutomation(updated)
    }
    setEditingId(null)
    triggerToast(`Schedule updated`, `${auto.name} · ${computed}`)
  }

  const handleStartAdd = (auto) => {
    setEnablingId(auto.id)
    setEditingId(null)
    if (auto.id === 3) {
      setEnableTiming('24 hours before appointment')
    } else if (auto.id === 4) {
      setEnableTiming('3 days before renewal')
    } else if (auto.id === 5) {
      setEnableTiming('Every 2 days · 6:00 PM')
    } else if (auto.id === 6) {
      setEnableTiming('Weekly on Friday · 10:00 AM')
    } else if (auto.id === 7) {
      setEnableTiming('Daily · 9:00 AM')
    } else if (auto.id === 8) {
      setEnableTiming('Daily · 2:00 PM')
    } else if (auto.id === 9) {
      setEnableTiming('Every 3 days · 4:00 PM')
    } else if (auto.id === 10) {
      setEnableTiming('Weekly on Sunday · 7:00 PM')
    } else if (auto.id === 11) {
      setEnableTiming('Morning after session · 10:00 AM')
    } else if (auto.id === 12) {
      setEnableTiming('Daily · 1:00 PM')
    } else if (auto.id === 13) {
      setEnableTiming('Bi-weekly on Monday · 11:00 AM')
    } else if (auto.id === 14) {
      setEnableTiming('Every 2 days · 11:00 AM')
    } else {
      setEnableTiming('Every day · 9:00 AM')
    }
  }

  const handleConfirmAdd = (auto) => {
    const updated = {
      ...auto,
      status: 'Active',
      frequency: enableTiming,
      schedule: enableTiming
    }
    if (onUpdateAutomation) {
      onUpdateAutomation(updated)
    } else if (onToggleStatus) {
      onToggleStatus(auto.id, 'Active')
    }
    setEnablingId(null)
    triggerToast(`${auto.name} enabled`, `Running for this client`)
  }

  const handleTogglePause = (auto) => {
    const newStatus = auto.status === 'Active' ? 'Paused' : 'Active'
    if (onToggleStatus) {
      onToggleStatus(auto.id, newStatus)
    } else if (onUpdateAutomation) {
      onUpdateAutomation({ ...auto, status: newStatus })
    }
    triggerToast(newStatus === 'Active' ? `${auto.name} resumed` : `${auto.name} paused`)
  }

  const handleDisableAutomation = (auto) => {
    if (onToggleStatus) {
      onToggleStatus(auto.id, 'Off')
    } else if (onUpdateAutomation) {
      onUpdateAutomation({ ...auto, status: 'Off' })
    }
    triggerToast(`${auto.name} disabled`, 'Moved to available follow-ups')
  }

  return (
    <div className="ehr-ca-layout animate-fadeIn">
      {/* ── React Hot Toast Container (Fixed top-left with hover pause) ── */}
      <Toaster position="top-right"
        containerClassName="ehr-hot-toaster-container"
        toastOptions={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0
          }
        }}
      />

      {/* ── In-Context Chat Modal Preview ── */}
      <CareAssistantChatModal
        automation={selectedChatAuto}
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
      />

      <div className="ehr-ca-container">
        {/* 1. Header */}
        <header className="ehr-ca-header">
          <div className="ehr-ca-header-left">
            <h1 className="ehr-ca-title">Care Assistant</h1>
            <p className="ehr-ca-subtitle">
              Care Assistant helps you stay on top of client care between sessions by handling routine reminders and check-ins automatically.
            </p>
          </div>

          <div className="ehr-ca-header-right">
            <div
              className={`ehr-saas-toggle-switch ${globalEnabled ? 'is-on' : 'is-off'}`}
              onClick={handleToggleGlobal}
              role="switch"
              aria-checked={globalEnabled}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggleGlobal(); } }}
              title={globalEnabled ? 'Turn off Care Assistant' : 'Turn on Care Assistant'}
            >
              <span className="ehr-saas-toggle-label">{globalEnabled ? 'ON' : 'OFF'}</span>
              <span className="ehr-saas-toggle-thumb" />
            </div>
          </div>
        </header>

        {/* 2. Body */}
        {!globalEnabled ? (
          /* GLOBALLY DISABLED STATE */
          <div className="ehr-ca-disabled-view animate-fadeIn">
            <h2 className="ehr-ca-disabled-heading">Care Assistant is turned off for this client.</h2>
            <p className="ehr-ca-disabled-desc">
              Turn it on to enable automated reminders and check-ins between sessions.
            </p>
            <button
              type="button"
              className="ehr-ca-btn-turn-on"
              onClick={() => {
                if (onToggleGlobal) onToggleGlobal(true)
                triggerToast('Care Assistant enabled', "Your client's configured follow-ups are active again.")
              }}
            >
              Turn on Care Assistant
            </button>
          </div>
        ) : (
          /* GLOBALLY ENABLED */
          <>
            {/* 2A. Primary Section: Running for this client */}
            <section className="ehr-ca-section">
              <div className="ehr-ca-sec-header">
                <h2 className="ehr-ca-sec-title">RUNNING FOR THIS CLIENT</h2>
                <span className="ehr-ca-sec-count">{activeCount} active</span>
              </div>

              {activeAutomations.length === 0 ? (
                <div className="ehr-ca-empty">
                  No follow-ups are running yet. Choose a follow-up below to automate routine communication.
                </div>
              ) : (
                <div className="ehr-ca-list">
                  {activeAutomations.map(auto => {
                    const isEditing = editingId === auto.id
                    const isActive = auto.status === 'Active'

                    return (
                      <div key={auto.id} className="ehr-ca-row">
                        <div className="ehr-ca-row-main">
                          <div className="ehr-ca-row-left">
                            <div className="ehr-ca-icon-wrap">
                              {getIcon(auto.iconType)}
                            </div>
                            <div className="ehr-ca-row-text">
                              <div className="ehr-ca-row-title-line">
                                <span className="ehr-ca-row-name">{auto.name}</span>
                                
                                {/* Info Tooltip on Hover */}
                                <div className="ehr-help-tooltip-wrap">
                                  <button
                                    type="button"
                                    className="ehr-help-icon-btn"
                                    aria-label={`Description for ${auto.name}`}
                                  >
                                    <HelpCircle size={13} />
                                  </button>
                                  <div className="ehr-help-tooltip-bubble">
                                    <span className="ehr-tooltip-title">{auto.name}</span>
                                    <p className="ehr-tooltip-text">{auto.description || auto.purpose}</p>
                                  </div>
                                </div>

                                <span className={`ehr-status-dot-label ${isActive ? 'is-active' : 'is-paused'}`}>
                                  <span className="ehr-dot" />
                                  <span>{isActive ? 'Active' : 'Paused'}</span>
                                </span>
                              </div>
                              <div className="ehr-ca-row-sched">
                                {isActive
                                  ? (auto.frequency || auto.schedule)
                                  : `Paused · was ${auto.frequency || auto.schedule}`}
                              </div>
                            </div>
                          </div>

                          {!isEditing && (
                            <div className="ehr-ca-row-actions">
                              {/* Eye icon: opens in-context centered preview modal */}
                              <div className="ehr-view-chat-wrap">
                                <button
                                  type="button"
                                  className="ehr-action-icon-btn"
                                  onClick={() => handleOpenChatModal(auto)}
                                  aria-label={`View chat for ${auto.name}`}
                                >
                                  <Eye size={15} />
                                </button>
                                <span className="ehr-view-chat-tooltip">View chat</span>
                              </div>

                              <button
                                type="button"
                                className="ehr-action-btn"
                                onClick={() => handleStartEdit(auto)}
                              >
                                Edit timing
                              </button>
                              <span className="ehr-action-sep">·</span>
                              <button
                                type="button"
                                className={`ehr-action-btn ${isActive ? 'is-pause' : 'is-resume'}`}
                                onClick={() => handleTogglePause(auto)}
                              >
                                {isActive ? 'Pause' : 'Resume'}
                              </button>
                              <span className="ehr-action-sep">·</span>
                              <button
                                type="button"
                                className="ehr-action-btn is-disable"
                                onClick={() => handleDisableAutomation(auto)}
                                title="Turn off and move to available"
                              >
                                Disable
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Edit Form */}
                        {isEditing && (
                          <div className="ehr-ca-inline-edit animate-fadeIn">
                            <div className="ehr-edit-selects-row">
                              <select
                                className="ehr-select"
                                value={configFreq}
                                onChange={e => setConfigFreq(e.target.value)}
                              >
                                <option value="Every day">Every day</option>
                                <option value="Every evening">Every evening</option>
                                <option value="Every 2 days">Every 2 days</option>
                                <option value="Every 3 days">Every 3 days</option>
                                <option value="Weekly on Monday">Weekly on Monday</option>
                                <option value="Weekly on Friday">Weekly on Friday</option>
                                <option value="Weekly on Sunday">Weekly on Sunday</option>
                              </select>

                              <select
                                className="ehr-select"
                                value={configTime}
                                onChange={e => setConfigTime(e.target.value)}
                              >
                                <option value="8:00 AM">8:00 AM</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="6:00 PM">6:00 PM</option>
                                <option value="7:00 PM">7:00 PM</option>
                                <option value="8:00 PM">8:00 PM</option>
                              </select>
                            </div>

                            <div className="ehr-edit-actions">
                              <button
                                type="button"
                                className="ehr-btn-cancel"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="ehr-btn-save"
                                onClick={() => handleSaveEdit(auto)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* 2B. Secondary Section: Available Follow-ups */}
            <section className="ehr-ca-section" style={{ marginTop: 24 }}>
              <div className="ehr-ca-sec-header">
                <div>
                  <h2 className="ehr-ca-sec-title">AVAILABLE FOLLOW-UPS</h2>
                  <p className="ehr-ca-sec-sub">Follow-ups you can enable for this client.</p>
                </div>
              </div>

              {availableAutomations.length === 0 ? (
                <div className="ehr-ca-empty">All available follow-ups are enabled.</div>
              ) : (
                <div className="ehr-ca-list">
                  {availableAutomations.map(auto => {
                    const isEnabling = enablingId === auto.id

                    return (
                      <div key={auto.id} className="ehr-ca-row ehr-ca-row--available">
                        <div className="ehr-ca-row-main">
                          <div className="ehr-ca-row-left">
                            <div className="ehr-ca-icon-wrap">
                              {getIcon(auto.iconType)}
                            </div>
                            <div className="ehr-ca-row-text">
                              <div className="ehr-ca-row-title-line">
                                <span className="ehr-ca-row-name">{auto.name}</span>
                                
                                {/* Info Tooltip on Hover */}
                                <div className="ehr-help-tooltip-wrap">
                                  <button
                                    type="button"
                                    className="ehr-help-icon-btn"
                                    aria-label={`Description for ${auto.name}`}
                                  >
                                    <HelpCircle size={13} />
                                  </button>
                                  <div className="ehr-help-tooltip-bubble">
                                    <span className="ehr-tooltip-title">{auto.name}</span>
                                    <p className="ehr-tooltip-text">{auto.description || auto.purpose}</p>
                                  </div>
                                </div>
                              </div>
                              <span className="ehr-ca-row-purpose">{auto.purpose}</span>
                            </div>
                          </div>

                          {!isEnabling && (
                            <div className="ehr-available-row-actions">
                              <button
                                type="button"
                                className="ehr-btn-add"
                                onClick={() => handleStartAdd(auto)}
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Enable Form */}
                        {isEnabling && (
                          <div className="ehr-ca-inline-edit animate-fadeIn">
                            <div className="ehr-edit-field-group">
                              <label className="ehr-field-lbl">When should this run?</label>
                              <select
                                className="ehr-select"
                                value={enableTiming}
                                onChange={e => setEnableTiming(e.target.value)}
                              >
                                {auto.id === 3 && (
                                  <>
                                    <option value="24 hours before appointment">24 hours before appointment</option>
                                    <option value="2 hours before appointment">2 hours before appointment</option>
                                    <option value="Morning of appointment">Morning of appointment</option>
                                  </>
                                )}
                                {auto.id === 4 && (
                                  <>
                                    <option value="3 days before renewal">3 days before renewal</option>
                                    <option value="7 days before renewal">7 days before renewal</option>
                                    <option value="On renewal date">On renewal date</option>
                                  </>
                                )}
                                {auto.id === 5 && (
                                  <>
                                    <option value="Every 2 days · 6:00 PM">Every 2 days · 6:00 PM</option>
                                    <option value="Daily · 7:00 PM">Daily · 7:00 PM</option>
                                    <option value="Weekly on Sunday · 5:00 PM">Weekly on Sunday · 5:00 PM</option>
                                  </>
                                )}
                                {auto.id === 6 && (
                                  <>
                                    <option value="Weekly on Friday · 10:00 AM">Weekly on Friday · 10:00 AM</option>
                                    <option value="Bi-weekly on Monday · 9:00 AM">Bi-weekly on Monday · 9:00 AM</option>
                                    <option value="Monthly · 1st of month">Monthly · 1st of month</option>
                                  </>
                                )}
                                {auto.id === 7 && (
                                  <>
                                    <option value="Daily · 9:00 AM">Daily · 9:00 AM</option>
                                    <option value="Daily · 8:00 AM">Daily · 8:00 AM</option>
                                    <option value="Weekly on Monday · 9:00 AM">Weekly on Monday · 9:00 AM</option>
                                  </>
                                )}
                                {auto.id === 8 && (
                                  <>
                                    <option value="Daily · 2:00 PM">Daily · 2:00 PM</option>
                                    <option value="Daily · 8:00 PM">Daily · 8:00 PM</option>
                                    <option value="Every morning · 7:30 AM">Every morning · 7:30 AM</option>
                                  </>
                                )}
                                {auto.id === 9 && (
                                  <>
                                    <option value="Every 3 days · 4:00 PM">Every 3 days · 4:00 PM</option>
                                    <option value="Weekly on Tuesday · 5:00 PM">Weekly on Tuesday · 5:00 PM</option>
                                    <option value="Daily · 5:00 PM">Daily · 5:00 PM</option>
                                  </>
                                )}
                                {auto.id === 10 && (
                                  <>
                                    <option value="Weekly on Sunday · 7:00 PM">Weekly on Sunday · 7:00 PM</option>
                                    <option value="Daily · 8:30 PM">Daily · 8:30 PM</option>
                                    <option value="Every Friday · 6:00 PM">Every Friday · 6:00 PM</option>
                                  </>
                                )}
                                {auto.id === 11 && (
                                  <>
                                    <option value="Morning after session · 10:00 AM">Morning after session · 10:00 AM</option>
                                    <option value="2 hours after session">2 hours after session</option>
                                    <option value="Same evening · 8:00 PM">Same evening · 8:00 PM</option>
                                  </>
                                )}
                                {auto.id === 12 && (
                                  <>
                                    <option value="Daily · 1:00 PM">Daily · 1:00 PM</option>
                                    <option value="Daily · 11:00 AM">Daily · 11:00 AM</option>
                                    <option value="Twice daily · 10:00 AM & 3:00 PM">Twice daily · 10:00 AM & 3:00 PM</option>
                                  </>
                                )}
                                {auto.id === 13 && (
                                  <>
                                    <option value="Bi-weekly on Monday · 11:00 AM">Bi-weekly on Monday · 11:00 AM</option>
                                    <option value="Monthly · 1st of month">Monthly · 1st of month</option>
                                    <option value="Weekly on Wednesday · 2:00 PM">Weekly on Wednesday · 2:00 PM</option>
                                  </>
                                )}
                                {auto.id === 14 && (
                                  <>
                                    <option value="Every 2 days · 11:00 AM">Every 2 days · 11:00 AM</option>
                                    <option value="Daily · 10:00 AM">Daily · 10:00 AM</option>
                                    <option value="Weekly on Saturday · 10:00 AM">Weekly on Saturday · 10:00 AM</option>
                                  </>
                                )}
                              </select>
                            </div>

                            <div className="ehr-edit-actions">
                              <button
                                type="button"
                                className="ehr-btn-cancel"
                                onClick={() => setEnablingId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="ehr-btn-save"
                                onClick={() => handleConfirmAdd(auto)}
                              >
                                Enable
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* 2C. Footer Note */}
            <footer className="ehr-ca-footer">
              Care Assistant only uses follow-ups you enable. You can pause or change them anytime.
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
