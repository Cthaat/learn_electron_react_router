import path from "path";
import { fileURLToPath } from "url";
import { app } from "electron";

export function getPreloadPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "preload.cjs");
}

export function getUIPath(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "..", "dist_react", "index.html");
}

export function getAssetPath(): string {
  if (app.isPackaged) {
    // 在打包环境中，资源位于 resources 文件夹
    return path.join(process.resourcesPath, "public");
  } else {
    // 在开发环境中，使用原有路径
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, "..", "public");
  }
}
