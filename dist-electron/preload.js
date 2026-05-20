import { contextBridge, ipcRenderer } from "electron";
//#region electron/preload.ts
contextBridge.exposeInMainWorld("electronAPI", {
	getAudioDevices: () => ipcRenderer.invoke("get-audio-devices"),
	loadSoundboard: (name) => ipcRenderer.invoke("load-soundboard", name),
	saveSoundboard: (name, data) => ipcRenderer.invoke("save-soundboard", name, data),
	listSoundboards: () => ipcRenderer.invoke("list-soundboards"),
	playSound: (filePath, deviceId) => ipcRenderer.invoke("play-sound", filePath, deviceId)
});
//#endregion

//# sourceMappingURL=preload.js.map