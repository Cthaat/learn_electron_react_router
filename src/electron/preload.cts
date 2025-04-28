// 导入 electron 模块
const electron = require("electron");

// 使用 contextBridge 将 API 安全地暴露给渲染进程
electron.contextBridge.exposeInMainWorld("electron", {
  // 订阅统计数据的方法，接收一个回调函数作为参数
  subscribeStatistics: (callback: (statistics: any) => void) => {
    // 监听主进程通过 IPC 发送的资源使用情况消息
    electron.ipcRenderer.on("resourceUsage", (_: any, stats: any) => {
      // 将接收到的统计数据传递给回调函数
      callback(stats);
    });
    // 初始化时调用一次回调，提供空对象作为初始值
    callback({});
  },
  // 获取静态数据的方法，通过 IPC 向主进程发送请求并等待响应
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
  // 确保暴露的 API 符合 Window["electron"] 类型定义
});
