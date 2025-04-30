import { app, Menu } from "electron";
import { ipcWebContentsSend, isDev } from "./util.js";

export function createMenu(mainWindow: Electron.BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "App",
        type: "submenu",
        submenu: [
          {
            label: "quit",
            click: app.quit,
          },
          {
            label: "Devtools",
            click: () => {
              mainWindow.webContents.openDevTools();
            },
            visible: isDev(),
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () =>
              ipcWebContentsSend("changeView", mainWindow.webContents, "CPU"),
          },
          {
            label: "RAM",
            click: () =>
              ipcWebContentsSend("changeView", mainWindow.webContents, "RAM"),
          },
          {
            label: "STORAGE",
            click: () =>
              ipcWebContentsSend(
                "changeView",
                mainWindow.webContents,
                "STORAGE"
              ),
          },
        ],
      },
    ])
  );
}
