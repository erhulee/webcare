import { createHmac } from "crypto"
export function generateCanvasDeviceID() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.fillText("__webcare__", 10, 10);
        const base64Data = canvas.toDataURL();
        return base64Data

    } else {
        return ""
    }
}

export function generateSessionID() {
    const did = generateCanvasDeviceID();
    const ua = navigator.userAgent;
    const now = Date.now();
    const random = Math.random() * 1000000;

    const hash = createHmac('sha256', did)
        .update(ua)
        .update(now.toString())
        .update(random.toString())
        .digest();
    // 生成 session id
    return hash.toString()
}