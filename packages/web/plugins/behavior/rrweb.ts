
import WebMonitor from "web/WebMonitor"
import { Plugin } from "share/Plugin"
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
                console.log("Record:", event);
                instance.rrwebStack.push(event);
            }
        })
    }
    unload() {

    }

}


