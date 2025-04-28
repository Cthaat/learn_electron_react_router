const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("resourceUsage", (_: any, stats: any) => {
      callback(stats);
    });
    callback({});
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
});
