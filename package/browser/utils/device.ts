import CryptoJS from "crypto-js/hmac-sha256"
export function generateCanvasDeviceID() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.fillText("__webcare__", 10, 10);
        const base64Data = canvas.toDataURL();
        return CryptoJS(base64Data, "webcare").toString();

    } else {
        return ""
    }
}

export function generateSessionID() {
    const did = generateCanvasDeviceID();
    const ua = navigator.userAgent;
    const now = Date.now();
    const random = Math.random() * 1000000;

    const result = CryptoJS(`${did}_${ua}_${now}_${random}`, "webcare").toString();

    // 生成 session id
    return result
}