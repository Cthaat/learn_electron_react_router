import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { pollResource } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { getDiskUsage } from "./resourceManager.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist_react/index.html"));
  }

  pollResource(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getDiskUsage();
  });
});
