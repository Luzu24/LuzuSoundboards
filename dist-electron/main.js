import { BrowserWindow, app, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
//#region electron/ipc.ts
var SOUNDBOARDS_PATH = "C:\\Program Files\\LuzuSoundboards\\Soundboards";
function registerIpcHandlers() {
	ipcMain.handle("list-soundboards", () => {
		if (!fs.existsSync(SOUNDBOARDS_PATH)) fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true });
		return fs.readdirSync(SOUNDBOARDS_PATH).filter((f) => f.endsWith(".json"));
	});
	ipcMain.handle("load-soundboard", (_event, name) => {
		const filePath = path.join(SOUNDBOARDS_PATH, name);
		if (!fs.existsSync(filePath)) throw new Error("Soundboard not found");
		return JSON.parse(fs.readFileSync(filePath, "utf-8"));
	});
	ipcMain.handle("save-soundboard", (_event, name, data) => {
		if (!fs.existsSync(SOUNDBOARDS_PATH)) fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true });
		const filePath = path.join(SOUNDBOARDS_PATH, name.endsWith(".json") ? name : `${name}.json`);
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
		return true;
	});
	ipcMain.handle("get-audio-devices", async () => {
		return [];
	});
}
//#endregion
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var mainWindow = null;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});
	if (process.env.VITE_DEV_SERVER_URL) mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	else mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}
app.whenReady().then(() => {
	registerIpcHandlers();
	createWindow();
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion

//# sourceMappingURL=main.js.map