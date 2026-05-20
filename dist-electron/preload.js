import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  getAudioDevices: () => ipcRenderer.invoke("get-audio-devices"),
  loadSoundboard: (name) => ipcRenderer.invoke("load-soundboard", name),
  saveSoundboard: (name, data) => ipcRenderer.invoke("save-soundboard", name, data),
  listSoundboards: () => ipcRenderer.invoke("list-soundboards"),
  getSoundPath: (fileName) => ipcRenderer.invoke("get-sound-path", fileName)
});
//# sourceMappingURL=preload.js.map
