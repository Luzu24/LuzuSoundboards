import { useState, useEffect, useRef } from 'react'
import { Settings, Play, Square, Volume2 } from 'lucide-react'
import './App.css'

interface SoundFile {
  name: string
  path: string
}

interface AudioDevice {
  deviceId: string
  label: string
}

export default function App() {
  const [sounds, setSounds] = useState<SoundFile[]>([])
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadSounds()
    loadAudioDevices()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function loadSounds() {
    try {
      const files: string[] = await (window as any).electronAPI.listSoundboards()
      const soundFiles = files
        .filter((f: string) => f.endsWith('.mp3') || f.endsWith('.wav'))
        .map((f: string) => ({
          name: f.replace(/\.(mp3|wav)$/i, ''),
          path: f,
        }))
      setSounds(soundFiles)
    } catch {
      setSounds([])
    }
  }

  async function loadAudioDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const all = await navigator.mediaDevices.enumerateDevices()
      const outputs = all
        .filter(d => d.kind === 'audiooutput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `Device ${d.deviceId.slice(0, 6)}` }))
      setDevices(outputs)
      if (outputs.length > 0) setSelectedDevice(outputs[0].deviceId)
    } catch {
      setDevices([])
    }
  }

  async function playSound(sound: SoundFile) {
    if (playingSound === sound.path) {
      audioRef.current?.pause()
      setPlayingSound(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const filePath = await (window as any).electronAPI.getSoundPath(sound.path)
    const audio = new Audio(filePath)

    if (selectedDevice && (audio as any).setSinkId) {
      await (audio as any).setSinkId(selectedDevice)
    }

    audio.onended = () => setPlayingSound(null)
    audioRef.current = audio
    setPlayingSound(sound.path)
    audio.play()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <Volume2 size={20} className="header-icon" />
          <span className="header-title">LuzuSoundboards</span>
        </div>
        <div className="header-right" ref={settingsRef}>
          <button className="settings-btn" onClick={() => setSettingsOpen(o => !o)}>
            <Settings size={18} />
          </button>
          {settingsOpen && (
            <div className="settings-dropdown">
              <p className="dropdown-label">Output Device</p>
              {devices.length === 0 ? (
                <p className="dropdown-empty">No devices found</p>
              ) : (
                devices.map(device => (
                  <button
                    key={device.deviceId}
                    className={`dropdown-item ${selectedDevice === device.deviceId ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDevice(device.deviceId)
                      setSettingsOpen(false)
                    }}
                  >
                    {device.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </header>

      <main className="grid-container">
        {sounds.length === 0 ? (
          <div className="empty-state">
            <Volume2 size={48} className="empty-icon" />
            <p>No sounds found</p>
            <span>Add .mp3 or .wav files to the Soundboards folder</span>
          </div>
        ) : (
          sounds.map(sound => (
            <div key={sound.path} className={`sound-card ${playingSound === sound.path ? 'playing' : ''}`}>
              <span className="sound-name">{sound.name}</span>
              <button className="play-btn" onClick={() => playSound(sound)}>
                {playingSound === sound.path ? <Square size={16} /> : <Play size={16} />}
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  )
}