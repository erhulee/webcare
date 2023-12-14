// /*
//     每隔 1s 向主线程发送一个检测包
//     然后将这个包放入队列中

//     收到主线程的包后，队列出队
//     //TODO: 这个“5”后续可以配置
//     当队列中的待确认包大于五个的时候，诊断为页面卡死
//     并且把页面已经卡死标注 = true
// */
// const msgQueue = [];
// // 崩溃只上报一次
// let isPost = false;

// // 把日志生成发进来，后续只修改 rrweb 和 datetime
// let loggerBased = {};
// let endpoint = "";
// let method = "";
// let app = "";

// function post() {
//     loggerBased.path = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + location.pathname + location.search;
//     isPost = true;

//     // 暂时不支持！！
//     if (method == "get" || method == "GET") {
//         const params = new URLSearchParams();
//         const keys = Object.keys(loggerBased);
//         keys.forEach(key => {
//             params.append(key, JSON.stringify(loggerBased[key]));
//         })
//         fetch(endpoint + "?" + params, {
//             method: method,
//         })
//     } else {

//         fetch(endpoint, {
//             method: method,
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 appid,
//                 logger: loggerBased
//             })
//         })
//     }
// }
// function init(logger, _endpoint, _method, _appid) {
//     loggerBased = logger;
//     appid = _appid
//     endpoint = _endpoint;
//     method = _method;
// }

// self.onmessage = function (e) {
//     const data = e.data;
//     const rrweb = data.rrweb_stack;
//     const type = data.type;
//     switch (type) {
//         case "init":
//             init(data.logger, data.endpoint, data.method, data.appid);
//             break;
//         case "sync":
//             loggerBased.rrweb_stack = data.rrweb_stack;
//             msgQueue.shift();
//             break;
//     }
// }


// var timer = setInterval(() => {
//     if (isPost) {
//         clearInterval(timer);
//         return;
//     }
//     if (msgQueue.length >= 5) {
//         post();
//     }
//     const queItem = "Web_Monitor_Test"
//     postMessage(queItem);
//     msgQueue.push(queItem);


// }, 1000);