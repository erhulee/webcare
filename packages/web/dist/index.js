class Monitor {
    constructor(appid, endpoint, method) {
        this.appid = appid;
        this.endpoint = endpoint;
        this.method = method;
        this.plugins = [];
    }
    initSender() {
        console.error("需要重写 InitSender 方法");
    }
}

class JSErrorLogger {
    constructor(message, stack) {
        this.category = "stability";
        this.type = "JSError";
        this.stack = stack;
        this.message = message;
    }
}

// 负责环境变量和指纹的注入
function createBaseLogger(monitor) {
    const userAgent = navigator.userAgent;
    const dateTime = new Date();
    const fingerPrint = monitor.fingerprint;
    return {
        userAgent,
        dateTime,
        fingerPrint
    };
}
function createJSErrorLogger(monitor, message, stack) {
    const env = createBaseLogger(monitor);
    const logger = new JSErrorLogger(message, stack);
    return Object.assign(Object.assign({}, env), logger);
}

// import { Plugin } from "../../../../core/plugin";
class JSErrorPlugin {
    constructor(instance) {
        this.instance = instance;
        this.hasError = false;
        this.events = [];
        const sender = instance.senderInstance;
        this.error_listener = (e) => {
            const log = createJSErrorLogger(instance, e.message, e.error.stack);
            sender === null || sender === void 0 ? void 0 : sender.post(log);
            this.hasError = true;
        };
        this.promise_listener = (e) => {
            var _a;
            if (e.target.localname !== undefined)
                return;
            const log = createJSErrorLogger(instance, e.message, (_a = e.error) === null || _a === void 0 ? void 0 : _a.stack);
            sender === null || sender === void 0 ? void 0 : sender.post(log);
            this.hasError = true;
        };
    }
    init() {
    }
    run() {
        console.log("开始监听");
        window.addEventListener("error", this.error_listener);
        window.addEventListener("unhandledrejection", this.promise_listener);
    }
    unload() {
        window.removeEventListener("error", this.error_listener);
        window.removeEventListener("unhandledrejection", this.promise_listener);
    }
}

function isStatusOk(status) {
    return !(status >= 400 && status < 600);
}

const KEY = "__Web_Monitor_List__";
class BeaconSender {
    constructor(endpoint, instance) {
        this.method = "post";
        this.endpoint = endpoint;
        this.instance = instance;
    }
    post(data) {
        window.navigator.sendBeacon(this.endpoint, JSON.stringify(data));
    }
}
class XHRSender {
    constructor(endpoint, instance, method, threshold = 1) {
        this.endpoint = endpoint;
        this.instance = instance;
        this.method = method;
        this.threshold = threshold;
        this.origin_threshold = threshold;
        this.cache = [];
    }
    _post() {
        const that = this;
        const data = this.cache;
        const promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(that.method, that.endpoint);
            xhr.setRequestHeader("Content-Type", 'application/json');
            xhr.send(JSON.stringify(data));
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState == 4) {
                    if (isStatusOk(this.status)) {
                        if (that.threshold !== that.origin_threshold)
                            that.threshold /= 2;
                        that.cache = [];
                        localStorage.removeItem(KEY);
                    }
                    else {
                        that.threshold *= 2;
                        localStorage.setItem(KEY, JSON.stringify(that.cache));
                    }
                    resolve(this.response);
                }
            });
        });
        return promise;
    }
    post(data) {
        this.cache.push(data);
        if (this.cache.length < this.threshold) {
            localStorage.setItem(KEY, JSON.stringify(this.cache));
            return Promise.resolve("cache success");
        }
        else {
            return this._post();
        }
    }
}

class WebMonitor extends Monitor {
    // private async setFingerPrint(){
    //     const fp = await fpPromise;
    //     const result = await fp.get();
    //     this.fingerprint = result.visitorId;
    // }
    constructor(appid, endpoint, method, senderType = "xhr", threshold = 1) {
        super(appid, endpoint, method);
        this.fingerprint = "unknown";
        this.plugins = [];
        // this.setFingerPrint();
        this.initSender(senderType, method, endpoint, threshold);
        this.initPlugins();
    }
    initSender(senderType, senderMethod, endpoint, threshold) {
        var _a;
        let _type = senderType;
        if (senderMethod == "get" && senderType == "beacon") {
            console.error("Beacon上报不支持 get 方法, 将用 xhr 继续上传");
            _type = "xhr";
        }
        else if (senderType == "beacon") {
            if (typeof ((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.sendBeacon) !== 'function') {
                console.error("浏览器不兼容Beacon，将用 xhr 继续上传");
                _type = "xhr";
            }
        }
        if (_type == "beacon") {
            this.senderInstance = new BeaconSender(endpoint, this);
        }
        else {
            this.senderInstance = new XHRSender(endpoint, this, senderMethod, threshold);
        }
    }
    initPlugins() {
        const plugins = [
            new JSErrorPlugin(this)
        ];
        this.plugins = plugins;
    }
    start() {
        this.plugins.forEach(plugin => {
            plugin.run();
        });
    }
}

export { WebMonitor as default };
