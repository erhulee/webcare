
// import {} from "web-vitals"
import  WebMonitor  from "web/WebMonitor"
import {Plugin} from "share/Plugin"
import { createBrowserHistory } from "history"
// import { captureNativeFn } from "web/utils/captureNativeFn.ts"

/*
    history: popState 事件
    hash: pushSate / replaceState 重写
*/

export class PVPlugin implements Plugin{
    instance:WebMonitor
    constructor(instance:WebMonitor){
        this.instance = instance
    }
    init(){

    }


    async run(){
       
    }
    unload(){
       
    }

}


