import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { pollResource } from "./resourceManager.js";
import { get } from "http";
import { getPreloadPath } from "./pathResolver.js";

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

  pollResource();
});
