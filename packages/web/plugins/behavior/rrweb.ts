
import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "@sniper/core"
import * as rrweb from "rrweb";
export class RrwebPlugin implements Plugin {
    instance: WebMonitor
    constructor(instance: WebMonitor) {
        this.instance = instance
    }
    init() {

    }
    async run() {
        const instance = this.instance
        rrweb.record({
            emit(event: any) {
                instance.rrwebStack.push(event);
            }
        })
    }
    unload() {

    }

}


