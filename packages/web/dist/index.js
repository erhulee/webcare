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

var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["Image"] = 0] = "Image";
    ResourceType[ResourceType["CSS"] = 1] = "CSS";
    ResourceType[ResourceType["Font"] = 2] = "Font";
    ResourceType[ResourceType["Javascript"] = 3] = "Javascript";
    ResourceType[ResourceType["Video"] = 4] = "Video";
    ResourceType[ResourceType["Audio"] = 5] = "Audio";
})(ResourceType || (ResourceType = {}));
class JSErrorLogger {
    constructor(message, stack) {
        this.category = "stability";
        this.type = "JS";
        this.stack = stack;
        this.message = message;
    }
}
class HTTPErrorLogger {
    constructor(code, url) {
        this.category = "stability";
        this.type = "HTTP";
        this.code = code;
        this.url = url;
    }
}
class ResourceLogger {
    constructor(resourceType, src) {
        this.category = "stability";
        this.type = "Resource";
        this.resourceType = resourceType;
        this.src = src;
    }
}

// 负责环境变量和指纹的注入
function createBaseLogger(monitor) {
    const userAgent = navigator.userAgent;
    const dateTime = new Date();
    const fingerPrint = monitor.fingerprint;
    const path = window.location.href;
    return {
        path,
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
function createHTTPLogger(monitor, response, type) {
    const env = createBaseLogger(monitor);
    let status = response.status;
    let url = "";
    if (type == "XHR") {
        const xhrResponse = response;
        url = xhrResponse.responseURL;
    }
    else {
        const fetchResponse = response;
        url = fetchResponse.url;
    }
    return Object.assign(Object.assign({}, env), new HTTPErrorLogger(status, url));
}
function createResourceLogger(monitor, type, url) {
    const env = createBaseLogger(monitor);
    return Object.assign(Object.assign({}, env), new ResourceLogger(type, url));
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

class HTTPPlugin {
    constructor(monitor) {
        this.instance = monitor;
        this.duringHijack = false;
    }
    init() { }
    run() {
        const instance = this;
        /* xhr 劫持 */
        this.nativeXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (...arg) {
            let self = this;
            self.addEventListener("abort", function () {
                // TODO abort 以后再说
                // const logger = createHTTPLogger("absort", "", {});
                // instance.monitor.senderInstance?.post(logger)
            });
            self.addEventListener("readystatechange", function () {
                var _a;
                if (this.readyState == 4 && !isStatusOk(this.status)) {
                    const logger = createHTTPLogger(instance.instance, this, "XHR");
                    (_a = instance.instance.senderInstance) === null || _a === void 0 ? void 0 : _a.post(logger);
                }
            });
            instance.nativeXHRSend.apply(self, arg);
        };
        /* fetch 劫持 */
        if (!window.fetch)
            return;
        this.nativeFetch = fetch;
        window.fetch = function (...arg) {
            const promise = instance.nativeFetch(...arg);
            promise.then((response) => {
                var _a;
                if (response.ok) {
                    //TODO 观察怎么拿到需要的信息
                    const logger = createHTTPLogger(instance.instance, response, "Fetch");
                    (_a = instance.instance.senderInstance) === null || _a === void 0 ? void 0 : _a.post(logger);
                }
            }, (error) => {
                // TODO abort 以后再说
                // const logger = createHTTPLogger("absort", "", {});
                // instance.monitor.sender?.post(logger)
            });
            return promise;
        };
    }
    unload() {
        XMLHttpRequest.prototype.send = this.nativeXHRSend;
        window.fetch = this.nativeFetch;
    }
}

/*
    1. performance
    2. window.onerror
    css、js、image、video、audio
*/
const tagName2ResourceType = {
    link: ResourceType.CSS,
    script: ResourceType.Javascript,
    img: ResourceType.Image,
    video: ResourceType.Video,
    audio: ResourceType.Audio
};
class ResourcePlugin {
    constructor(instance) {
        this.listener = null;
        this.instance = instance;
    }
    init() {
    }
    run() {
        const that = this;
        const listener = function (e) {
            var _a;
            const typeName = e.target.localName;
            const url = e.target.src;
            let logger = createResourceLogger(that.instance, tagName2ResourceType[typeName], url);
            (_a = that.instance.senderInstance) === null || _a === void 0 ? void 0 : _a.post(logger);
        };
        this.listener = listener;
        window.addEventListener("error", listener, true);
    }
    ;
    unload() {
        if (this.listener) {
            window.removeEventListener("error", this.listener);
        }
    }
    ;
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
            new JSErrorPlugin(this),
            new HTTPPlugin(this),
            new ResourcePlugin(this)
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
