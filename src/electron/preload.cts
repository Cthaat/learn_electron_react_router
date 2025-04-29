const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) => {
    ipcOn("statistic", (stats) => {
      callback(stats);
    });
  },
  getStaticData: () => ipcInveke("getStaticData"),
} satisfies Window["electron"]);

function ipcInveke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  electron.ipcRenderer.on(key, (_: any, payload: EventPayloadMapping[Key]) =>
    callback(payload)
  );
}
