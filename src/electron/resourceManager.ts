import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCupUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    ipcWebContentsSend("statistic", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

function getCupUsage(): Promise<number> {
  return new Promise((resolve) => {
    // 使用 Node.js 原生的 os 模块替代 os-utils
    const startMeasure = getCpuInfo();
    setTimeout(() => {
      const endMeasure = getCpuInfo();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      const cpuUsage = 1 - idleDifference / totalDifference;
      resolve(cpuUsage);
    }, 100);
  });
}

// 获取 CPU 信息的辅助函数
function getCpuInfo() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type as keyof typeof cpu.times];
    }
    idle += cpu.times.idle;
  }

  return { idle, total };
}

function getRamUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  return (totalMem - freeMem) / totalMem;
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(os.totalmem() / (1024 * 1024 * 1024));

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}
