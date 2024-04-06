var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HTTPPlugin: () => HTTPPlugin,
  JsErrorPlugin: () => jserror_default,
  Monitor: () => Monitor,
  ResourcePlugin: () => resource_default,
  XHRSender: () => xhr_default
});
module.exports = __toCommonJS(src_exports);

// src/runtime/index.ts
var Monitor = class {
  constructor(options) {
    this.plugins = [];
    this.event_bus = /* @__PURE__ */ new Map();
    this.hijackCache = /* @__PURE__ */ new Map();
    this.env = {};
    this.appid = options.appid;
    this.endpoint = options.endpoint;
    window.__SNIPER__ = this;
  }
  get sender_method() {
    return this.sender.method || "post";
  }
  /* -- 劫持原生 api 三件套*/
  hijackFn(key, fn, instance) {
    const origin_fn = instance[key];
    instance[key] = function(...args) {
      return fn.call(this, ...args);
    };
    this.hijackCache.set(key, {
      fn: origin_fn,
      owner: instance
    });
  }
  getHijackFn(key, callback = () => {
  }) {
    const hijackItem = this.hijackCache.get(key);
    if (hijackItem == null) {
      return callback;
    } else {
      return this.hijackCache.get(key).fn;
    }
  }
  releaseHijackFn(key) {
    debugger;
    const { fn, owner } = this.hijackCache.get(key);
    owner[key] = fn;
  }
  call(eventName, ...args) {
    if (!this.event_bus.has(eventName)) {
      console.log("[sniper]: 未实现该事件");
    }
    this.event_bus.get(eventName).forEach((fn) => fn(...args));
  }
  use(element) {
    if (Array.isArray(element)) {
      element.forEach((plugin) => {
        console.log(plugin.monitor);
        this.plugins.push(plugin);
        if (typeof plugin.events == "function") {
          const event_entry = plugin.events();
          const event_name = Object.keys(event_entry);
          event_name.forEach((event) => {
            const event_callback = event_entry[event].bind(plugin);
            if (this.event_bus.has(event)) {
              this.event_bus.get(event).push(event_callback);
            } else {
              this.event_bus.set(event, [event_callback]);
            }
          });
        }
      });
    } else {
      this.sender = element;
    }
  }
  start(env) {
    if (env)
      this.env = env;
    if (this.sender == null) {
      console.log("[sender]: 未初始化发送器");
      return;
    }
    this.plugins.forEach((plugin) => plugin.run());
  }
  unload() {
    this.plugins.forEach((plugin) => plugin.unload());
  }
  track(data) {
    this.sender.send(data);
  }
  send(data) {
    console.log("[sniper send]:", data);
    this.sender.send(data);
  }
};

// src/runtime/connect.ts
var connect = (target) => {
  Object.defineProperty(target.prototype, "monitor", {
    get() {
      return window.__SNIPER__;
    }
  });
};

// src/utils/LimitQueue.ts
var LimitQueue = class {
  constructor(size) {
    this.data = [];
    this.size = size;
  }
  add(data) {
    if (this.data.length > this.size)
      this.data.shift();
    this.data.push(data);
  }
  get value() {
    return this.data;
  }
};

// src/factory/base.ts
var import_lodash_es = require("lodash-es");
function InjectEnvironmentInfo(log) {
  const timestamp = Date.now();
  const pathname = location.pathname;
  const query = location.search;
  const ua = navigator.userAgent;
  (0, import_lodash_es.set)(log, "env.timestamp", timestamp);
  (0, import_lodash_es.set)(log, "env.pathname", pathname);
  (0, import_lodash_es.set)(log, "env.query", query);
  (0, import_lodash_es.set)(log, "env.ua", ua);
}

// src/factory/jserror.ts
function createJSErrorLogger(params, monitor) {
  const logger = {
    category: "stability",
    type: "js_error",
    detail: params
  };
  InjectEnvironmentInfo(logger);
  return logger;
}

// src/factory/unhandled_promise.ts
function createPromiseLogger(params, monitor) {
  const logger = {
    category: "stability",
    type: "unhandled_promise",
    detail: params
  };
  InjectEnvironmentInfo(logger);
  return logger;
}

// src/plugins/stability/jserror.ts
var JsErrorPlugin = class {
  run() {
    this.error_listener = (e) => {
      const { stack, message } = e.error;
      this.monitor.send(createJSErrorLogger({ stack, message }));
    };
    this.promise_listener = (e) => {
      this.monitor.send(createPromiseLogger({}));
    };
    window.addEventListener("error", this.error_listener);
    window.addEventListener("unhandledrejection", this.promise_listener);
  }
  unload() {
    window.removeEventListener("error", this.error_listener);
    window.removeEventListener("unhandledrejection", this.promise_listener);
  }
  events() {
    return {
      rrweb: (event) => {
        this.rrwebQueue.add(event);
      }
    };
  }
  //  屏幕录制buffer尺寸
  constructor(rrweb_size = 20) {
    this.rrwebQueue = new LimitQueue(rrweb_size);
  }
};
JsErrorPlugin = __decorateClass([
  connect
], JsErrorPlugin);
var jserror_default = JsErrorPlugin;

// src/utils/buildQuery.ts
function buildQuery(path) {
  const urlObj = new URL(path);
  return urlObj.search;
}

// src/factory/http.ts
function createHTTPErrorLogger(params, monitor) {
  const logger = {
    category: "stability",
    type: "http",
    detail: params
  };
  InjectEnvironmentInfo(logger);
  return logger;
}

// src/plugins/stability/http.ts
function isStatusOk(status) {
  return !(status >= 400 && status < 600);
}
var HTTPPlugin = class {
  constructor() {
  }
  run() {
    const monitor = this.monitor;
    this.monitor.hijackFn("send", function(...args) {
      const native_send = that.monitor.getHijackFn("send");
      const body = args[0];
      const callback = function() {
        const url = this.responseURL;
        const query = buildQuery(url);
        if (this.readyState == 4 && !isStatusOk(this.status)) {
          const status = this.status;
          const status_text = this.statusText;
          const logger = createHTTPErrorLogger({
            url,
            query,
            body,
            status,
            status_text
          });
          monitor.send(logger);
        }
      };
      this.addEventListener("readystatechange", callback);
      native_send.call(this, ...args);
    }, XMLHttpRequest.prototype);
    if (!window.fetch)
      return;
    const that = this;
    this.monitor.hijackFn("fetch", function(...args) {
      const native_fetch = that.monitor.getHijackFn("fetch");
      const promise = native_fetch(...args);
      const [resource, options = {}] = args;
      const {
        method = "GET",
        body = {}
      } = options;
      const query = buildQuery(resource);
      promise.then((response) => __async(this, null, function* () {
        if (!isStatusOk(response.status)) {
          const { status, statusText } = response;
          const logger = createHTTPErrorLogger({
            method,
            url: resource,
            query,
            status,
            status_text: statusText,
            body
          });
          monitor.send(logger);
        }
        return response;
      })).catch((reason) => {
        const logger = createHTTPErrorLogger({
          method,
          url: resource,
          query,
          status: -1,
          status_text: "unknown",
          body
        });
        monitor.send(logger);
        return Promise.reject(reason);
      });
      return promise;
    }, window);
  }
  unload() {
    this.monitor.releaseHijackFn("send");
    this.monitor.releaseHijackFn("fetch");
  }
};
HTTPPlugin = __decorateClass([
  connect
], HTTPPlugin);

// src/factory/resouce.ts
function createResourceErrorLogger(params, monitor) {
  const logger = {
    category: "stability",
    type: "resource",
    detail: params
  };
  InjectEnvironmentInfo(logger);
  return logger;
}
var resouce_default = createResourceErrorLogger;

// src/plugins/stability/resource.ts
var ResourcePlugin = class {
  constructor() {
    this.listener = null;
    this.performanceObserver = null;
  }
  run() {
    const that = this;
    if (typeof PerformanceObserver == "function") {
      this.performanceObserver = new PerformanceObserver((list, observer) => {
        const entries = list.getEntriesByType("resource");
        entries.forEach((entry) => {
          if (entry.initiatorType == "xmlhttprequest" || entry.transferSize !== 0)
            return;
          const url = entry.name;
          const log = resouce_default({
            file_url: url
          });
          that.monitor.send(log);
        });
      });
      this.performanceObserver.observe({
        entryTypes: ["resource"]
      });
    } else {
      this.listener = function(e) {
        const target = e.target;
        if (target == window)
          return;
        const nodeName = target.nodeName;
        if (nodeName == "LINK") {
          that.monitor.send(resouce_default({
            file_url: "link"
          }));
        }
      };
      window.addEventListener("error", this.listener, true);
    }
  }
  unload() {
    this.listener && window.removeEventListener("error", this.listener);
  }
};
ResourcePlugin = __decorateClass([
  connect
], ResourcePlugin);
var resource_default = ResourcePlugin;

// src/sender/xhr.ts
var XHRSender = class {
  get endpoint() {
    return this.monitor.endpoint;
  }
  constructor(method) {
    this.method = method;
  }
  send(log) {
    console.log("[sniper sender]: send", log);
    const origin_open = this.monitor.getHijackFn("open", XMLHttpRequest.prototype.open);
    const origin_send = this.monitor.getHijackFn("send");
    const xhr = new XMLHttpRequest();
    origin_open.call(xhr, this.method, this.endpoint);
    xhr.setRequestHeader("Content-Type", "application/json");
    origin_send.call(xhr, JSON.stringify(log));
  }
};
XHRSender = __decorateClass([
  connect
], XHRSender);
var xhr_default = XHRSender;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HTTPPlugin,
  JsErrorPlugin,
  Monitor,
  ResourcePlugin,
  XHRSender
});
