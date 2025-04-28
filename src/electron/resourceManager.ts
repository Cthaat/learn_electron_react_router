import osUtil from "os-utils";

const POLLING_INTERVAL = 500;

export function pollResources() {
  setInterval(() => {
    getCupUsage();
  }, POLLING_INTERVAL);
}

function getCupUsage() {
  osUtil.cpuUsage((percentage) =>
    console.log(`CPU Usage: ${percentage * 100}%`)
  );
}
