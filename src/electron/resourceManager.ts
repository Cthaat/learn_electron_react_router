import osUtil from "os-utils";
import fs from "fs";
import os from "os";

const POLLING_INTERVAL = 1000; // 1 second

/**
 * 磁盘使用和系统信息接口
 */
export interface IDiskUsageInfo {
  /** 磁盘使用率（0-1之间的值，表示已使用的比例） */
  diskUsage: number;
  /** CPU型号信息 */
  cpuModel: string;
  /** 系统总内存（GB） */
  totalMemoryGB: number;
}

export function pollResource() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const freeMemory = getMemoryUsage();
    const diskUsage = await getDiskUsage();
    const usage = {
      cpu: cpuUsage,
      memory: freeMemory,
      disk: diskUsage,
    };
    console.log("Resource Usage:", usage);
  }, POLLING_INTERVAL);
}

function getCpuUsage(): Promise<number> {
  return new Promise<number>((resolve) => {
    osUtil.cpuUsage(resolve);
  });
}

function getMemoryUsage() {
  return 1 - osUtil.freememPercentage();
}

function getDiskUsage(): Promise<IDiskUsageInfo> {
  return new Promise<IDiskUsageInfo>((resolve) => {
    fs.statfs(process.platform === "win32" ? "C://" : "/", (err, stats) => {
      if (err) {
        console.error("Error getting disk stats:", err);
        resolve({
          diskUsage: 0,
          cpuModel: "Unknown",
          totalMemoryGB: 0,
        });
        return;
      }
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      const cpuModel = os.cpus()[0].model;
      const totalMemoryGB = Math.floor(osUtil.totalmem() / 1024);
      resolve({
        diskUsage: 1 - free / total,
        cpuModel: cpuModel,
        totalMemoryGB: totalMemoryGB,
      });
    });
  });
}
