import {Plugin} from "share/Plugin"
import { WXMonitor } from "../../WXMonitor";
const rewriteList: ("request" | "downloadFile" | "uploadFile")[] = [
    "request",
    "downloadFile",
    "uploadFile"
] 
export class HTTPPlugin implements Plugin{
    instance: WXMonitor;
    constructor(monitor: WXMonitor){
        this.instance = monitor;
    }
    init(){}
    run(){
        // const that = 
        rewriteList.forEach(method=>{
            const originMethod = wx[method];
            
            Object.defineProperty(wx, method, {
                writable: true,
                enumerable: true,
                configurable: true,
                value: function(...args: any[]){
                    const options = args[0]
                    // 获取需要的数据信息
                    const { url, method, header, reqData } = options
                    // 收集小程序的请求信息
                    // const httpCollect = {
                    //   request: {
                    //     httpType: HttpTypes.XHR,
                    //     url,
                    //     method,
                    //     data: reqData
                    //   },
                    //   response: {},
                    //   time: Date.now()
                    // }
                    // 成功回调
                    const successHandler = function (res) {
                      httpCollect.response.data = res.data
                      // 通知订阅中心
                      notify(WxBaseEventTypes.REQUEST, httpCollect)
                      return options.success(res)
                    }
                    const _fail = options.fail
                    // 失败回调
                    const failHandler = function (err) {
                      // 系统和网络层面的失败
                      httpCollect.errMsg = err.errMsg
                      // 通知订阅中心
                      notify(WxBaseEventTypes.REQUEST, httpCollect)
                      return _fail(err)
                    }
                    const actOptions = {
                      ...options,
                      success: successHandler,
                      fail: failHandler
                    }
                    // return 原始函数
                    return originRequest.call(this, actOptions)
                }
            })

        })
    }
    unload(){

    }

}