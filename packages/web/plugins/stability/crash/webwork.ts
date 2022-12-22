export const work_source = `
const msgQueue = [];
// 崩溃只上报一次
let   isPost   = false;

// 把日志先生成发进来
let   loggerBased = {};
let   endpoint = "";
let   method   = "";


function post(){
    loggerBased.path = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + location.pathname + location.search;
    if(method == "get" || method == "GET"){
        const params = new URLSearchParams();
        const keys = Object.keys(loggerBased);
        keys.forEach(key=>{
            params.append(key, JSON.stringify(loggerBased[key]));
        })
        fetch(endpoint+"?"+params, {
            method: method,
        }).then(()=>{
            isPost = true;
        })
    }else{
        fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loggerBased)
        }).then(()=>{
            isPost = true;
        })
    }
}
function init(logger, _endpoint, _method){
    console.log(logger)
    loggerBased = logger;
    endpoint    = _endpoint;
    method      = _method;
}

self.onmessage = function(e){
    const data = e.data;
    const type = data.type;
    switch(type){
        case "init":
            init(data.logger, data.endpoint, data.method);
            break;
        default:
            msgQueue.pop();
    }
    
}

setInterval(()=>{
    if(msgQueue.length >= 1 && !isPost){
        post();
    }else {
        const queItem = "Web_Monitor_Test"
        postMessage(queItem);
        msgQueue.push(queItem);
    }
}, 5000);

`