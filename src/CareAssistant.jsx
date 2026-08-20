import React, { useState, useEffect } from 'react'
import { Pill, Smile, Calendar, CreditCard, Eye } from 'lucide-react'
import CareAssistantChatModal from './components/CareAssistantChatModal'

export const DEFAULT_AUTOMATIONS = [
  {
    id: 1,
    name: 'Medication Reminder',
    purpose: 'Help client stay consistent with medication schedule.',
    status: 'Active',
    frequency: 'Daily · 8:00 AM',
    schedule: 'Daily · 8:00 AM',
    iconType: 'pill'
  },
  {
    id: 2,
    name: 'Daily Mood Check-in',
    purpose: 'Check in about mood and well-being between sessions.',
    status: 'Active',
    frequency: 'Every evening · 8:00 PM',
    schedule: 'Every evening · 8:00 PM',
    iconType: 'mood'
  },
  {
    id: 3,
    name: 'Session Reminder',
    purpose: 'Before upcoming appointments',
    status: 'Off',
    frequency: '24 hours before appointment',
    schedule: '24 hours before appointment',
    iconType: 'calendar'
  },
  {
    id: 4,
    name: 'Payment & Renewal',
    purpose: 'Upcoming package/payment reminders',
    status: 'Off',
    frequency: '3 days before renewal',
    schedule: '3 days before renewal',
    iconType: 'billing'
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

  // In-Context Chat Modal State (Does NOT leave Care Assistant)
  const [selectedChatAuto, setSelectedChatAuto] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Configure states
  const [configFreq, setConfigFreq] = useState('Every day')
  const [configTime, setConfigTime] = useState('8:00 AM')

  // Enable states
  const [enableTiming, setEnableTiming] = useState('24 hours before appointment')

  // Snackbar Toast with Undo
  const [snackbar, setSnackbar] = useState(null)

  useEffect(() => {
    if (!snackbar) return
    const timer = setTimeout(() => {
      setSnackbar(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [snackbar])

  const showSnackbar = (title, subtitle = null, showUndo = false) => {
    setSnackbar({ title, subtitle, showUndo })
  }

  const activeAutomations = automations.filter(a => a.status === 'Active' || a.status === 'Paused')
  const availableAutomations = automations.filter(a => a.status === 'Off' || !a.status)
  const activeCount = automations.filter(a => a.status === 'Active').length

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
      default:
        return <Pill size={15} className="ehr-icon" />
    }
  }

  const handleToggleGlobal = () => {
    const newState = !globalEnabled
    if (onToggleGlobal) onToggleGlobal(newState)

    if (!newState) {
      showSnackbar('Care Assistant turned off', 'Automated follow-ups for this client have stopped.', true)
    } else {
      showSnackbar('Care Assistant enabled', "Your client's configured follow-ups are active again.", false)
    }
  }

  const handleUndo = () => {
    if (onToggleGlobal) onToggleGlobal(true)
    setSnackbar(null)
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
    showSnackbar(`Updated ${auto.name}`)
  }

  const handleStartAdd = (auto) => {
    setEnablingId(auto.id)
    setEditingId(null)
    if (auto.id === 3) {
      setEnableTiming('24 hours before appointment')
    } else {
      setEnableTiming('3 days before renewal')
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
    showSnackbar(`${auto.name} enabled`)
  }

  const handleTogglePause = (auto) => {
    const newStatus = auto.status === 'Active' ? 'Paused' : 'Active'
    if (onToggleStatus) {
      onToggleStatus(auto.id, newStatus)
    } else if (onUpdateAutomation) {
      onUpdateAutomation({ ...auto, status: newStatus })
    }
    showSnackbar(newStatus === 'Active' ? `${auto.name} resumed` : `${auto.name} paused`)
  }

  return (
    <div className="ehr-ca-layout animate-fadeIn">
      {/* ── In-Context Chat Modal Preview (Opens right over Care Assistant) ── */}
      <CareAssistantChatModal
        automation={selectedChatAuto}
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
      />

      {/* ── Bottom Snackbar with Undo ── */}
      {snackbar && (
        <div className="ehr-ca-bottom-snackbar animate-slideUp">
          <div className="ehr-snackbar-content">
            <div className="ehr-snackbar-title">{snackbar.title}</div>
            {snackbar.subtitle && (
              <div className="ehr-snackbar-subtitle">{snackbar.subtitle}</div>
            )}
          </div>
          {snackbar.showUndo && (
            <button
              type="button"
              className="ehr-snackbar-undo-btn"
              onClick={handleUndo}
            >
              Undo
            </button>
          )}
        </div>
      )}

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
                showSnackbar('Care Assistant enabled', "Your client's configured follow-ups are active again.", false)
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
                                <option value="Weekly on Monday">Weekly on Monday</option>
                              </select>

                              <select
                                className="ehr-select"
                                value={configTime}
                                onChange={e => setConfigTime(e.target.value)}
                              >
                                <option value="8:00 AM">8:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="6:00 PM">6:00 PM</option>
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
                              <span className="ehr-ca-row-name">{auto.name}</span>
                              <span className="ehr-ca-row-purpose">{auto.purpose}</span>
                            </div>
                          </div>

                          {!isEnabling && (
                            <button
                              type="button"
                              className="ehr-btn-add"
                              onClick={() => handleStartAdd(auto)}
                            >
                              Add
                            </button>
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
                                {auto.id === 3 ? (
                                  <>
                                    <option value="24 hours before appointment">24 hours before appointment</option>
                                    <option value="2 hours before appointment">2 hours before appointment</option>
                                    <option value="Morning of appointment">Morning of appointment</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="3 days before renewal">3 days before renewal</option>
                                    <option value="7 days before renewal">7 days before renewal</option>
                                    <option value="On renewal date">On renewal date</option>
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
