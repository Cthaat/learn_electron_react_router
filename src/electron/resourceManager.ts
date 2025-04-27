import osUtil from "os-utils";
import fs from "fs";

const POLLING_INTERVAL = 1000; // 1 second

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

function getDiskUsage() {
  return new Promise<number>((resolve) => {
    fs.statfs(process.platform === "win32" ? "C://" : "/", (err, stats) => {
      if (err) {
        console.error("Error getting disk stats:", err);
        resolve(0);
        return;
      }
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      resolve(1 - free / total);
    });
  });
}
