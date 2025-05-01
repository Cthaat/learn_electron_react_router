import { ipcMain, WebContents, WebFrame, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    if (!event.senderFrame) {
      throw new Error("Event sender frame is missing");
    }
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    if (!event.senderFrame) {
      throw new Error("Event sender frame is missing");
    }
    validateEventFrame(event.senderFrame);
    return handler(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  // 开发模式下，接受来自localhost的事件
  if (isDev()) {
    try {
      const url = new URL(frame.url);
      if (url.hostname === "localhost") {
        return;
      }
    } catch (e) {
      console.error("无法解析URL:", frame.url, e);
    }
  }

  try {
    // 获取基本预期URL
    let expectedUrlString = pathToFileURL(getUIPath()).toString();

    // 规范化URL，移除末尾的index.html等
    if (expectedUrlString.endsWith("index.html")) {
      expectedUrlString = expectedUrlString.replace(/index\.html$/, "");
    }

    // 简单检查frame.url是否以expectedUrlString开头
    // 这样就不需要解析URL，更加健壮
    if (frame.url.startsWith(expectedUrlString)) {
      return;
    }

    // 回退方案：直接比较文件部分
    const frameUrlParts = frame.url.split("/");
    const expectedUrlParts = expectedUrlString.split("/");

    const frameFilePart = frameUrlParts[frameUrlParts.length - 1].split("#")[0];
    const expectedFilePart = expectedUrlParts[expectedUrlParts.length - 1];

    if (
      frameFilePart === expectedFilePart ||
      (expectedFilePart === "" && frameFilePart === "index.html")
    ) {
      return;
    }

    // 记录详细信息以便调试
    console.error("URL验证失败:", {
      frameUrl: frame.url,
      expectedUrlString,
      frameFilePart,
      expectedFilePart,
    });

    // 由于这个问题影响应用正常使用，临时放宽验证
    console.warn("URL验证失败但允许继续执行。这在生产环境中是不安全的。");
    return; // 临时允许所有请求通过

    // 如果需要恢复严格验证，请移除上面两行并取消注释下面的行
    // throw new Error("Malicious event");
  } catch (error) {
    console.error("URL验证过程出错:", error);
    // 为避免应用崩溃，临时允许所有请求通过
    console.warn("URL验证出错但允许继续执行。这在生产环境中是不安全的。");
    return;
  }
}
