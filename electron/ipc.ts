import { ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

const SOUNDBOARDS_PATH = 'C:\\Program Files\\LuzuSoundboards\\Soundboards'

export function registerIpcHandlers() {
  ipcMain.handle('list-soundboards', () => {
    if (!fs.existsSync(SOUNDBOARDS_PATH)) {
      fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true })
    }
    return fs.readdirSync(SOUNDBOARDS_PATH).filter((f: string) =>
      f.endsWith('.mp3') || f.endsWith('.wav')
    )
  })

  ipcMain.handle('load-soundboard', (_event: any, name: string) => {
    const filePath = path.join(SOUNDBOARDS_PATH, name)
    if (!fs.existsSync(filePath)) throw new Error('Soundboard not found')
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  })

  ipcMain.handle('save-soundboard', (_event: any, name: string, data: unknown) => {
    if (!fs.existsSync(SOUNDBOARDS_PATH)) {
      fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true })
    }
    const filePath = path.join(SOUNDBOARDS_PATH, name.endsWith('.json') ? name : `${name}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  })

  ipcMain.handle('get-sound-path', (_event: any, fileName: string) => {
    return path.join(SOUNDBOARDS_PATH, fileName)
  })

  ipcMain.handle('get-audio-devices', () => {
    return []
  })
}