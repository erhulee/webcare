
import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "@sniper/core"

/*
    history: popState 事件
    hash: pushSate / replaceState 重写
*/

export class EventsPlugin implements Plugin {
    instance: WebMonitor
    eventKeys = ["click", "input", "keydown", "keyup"]
    collectEventHandle = (e: any) => {
        const pathName = location.href;
        while (this.instance.eventStack.length >= 20) {
            this.instance.eventStack.shift();
        }
        this.instance.eventStack.push({
            pathName,
            event: e
        })
    }
    constructor(instance: WebMonitor) {
        this.instance = instance
    }
    init() {

    }
    async run() {
        this.eventKeys.forEach((event) => {
            document.addEventListener(event, this.collectEventHandle)
        })
    }
    unload() {
        this.eventKeys.forEach((event) => {
            document.removeEventListener(event, this.collectEventHandle)
        })
    }

}


