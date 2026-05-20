import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const SOUNDBOARDS_PATH = "C:\\Program Files\\LuzuSoundboards\\Soundboards";
function registerIpcHandlers() {
  ipcMain.handle("list-soundboards", () => {
    if (!fs.existsSync(SOUNDBOARDS_PATH)) {
      fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true });
    }
    return fs.readdirSync(SOUNDBOARDS_PATH).filter(
      (f) => f.endsWith(".mp3") || f.endsWith(".wav")
    );
  });
  ipcMain.handle("load-soundboard", (_event, name) => {
    const filePath = path.join(SOUNDBOARDS_PATH, name);
    if (!fs.existsSync(filePath)) throw new Error("Soundboard not found");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  });
  ipcMain.handle("save-soundboard", (_event, name, data) => {
    if (!fs.existsSync(SOUNDBOARDS_PATH)) {
      fs.mkdirSync(SOUNDBOARDS_PATH, { recursive: true });
    }
    const filePath = path.join(SOUNDBOARDS_PATH, name.endsWith(".json") ? name : `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  });
  ipcMain.handle("get-sound-path", (_event, fileName) => {
    return path.join(SOUNDBOARDS_PATH, fileName);
  });
  ipcMain.handle("get-audio-devices", () => {
    return [];
  });
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Luzu Soundboards",
    autoHideMenuBar: true,
    icon: path.join(__dirname$1, "../public/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
}
app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
//# sourceMappingURL=main.js.map
