function createBaseLogger() {
    // const userAgent = navigator.userAgent;
    const dateTime  = new Date();
    // // const fingerPrint = monitor.fingerprint;
    // const path = window.location.href;
    const systemInfo = wx.getSystemInfoSync();
    const deviceInfo = wx.getDeviceInfo();
    return {
        // path,
        // userAgent,
        dateTime,
        // fingerPrint
    }
}
