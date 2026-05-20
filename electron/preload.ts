import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAudioDevices: () => ipcRenderer.invoke('get-audio-devices'),
  loadSoundboard: (name: string) => ipcRenderer.invoke('load-soundboard', name),
  saveSoundboard: (name: string, data: unknown) => ipcRenderer.invoke('save-soundboard', name, data),
  listSoundboards: () => ipcRenderer.invoke('list-soundboards'),
  playSound: (filePath: string, deviceId: string) => ipcRenderer.invoke('play-sound', filePath, deviceId),
})