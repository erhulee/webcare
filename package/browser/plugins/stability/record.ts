/**
 * rrweb 录制
 */

import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { GLOBAL_METHOD } from "@/runtime/global";
import { Plugin } from "@/types/plugin";
import { LimitQueue } from "@/utils/LimitQueue";
import * as rrweb from "rrweb";
@connect
export class RecordPlugin implements Plugin {
    monitor!: Monitor;
    rrwebQueue: LimitQueue<any> = new LimitQueue(50)
    run() {
        const plugin = this
        rrweb.record({
            emit(event) {
                plugin.rrwebQueue.add(event)
            }
        })
    }
    unload() {

    }
    globalMethod = {
        [GLOBAL_METHOD.GET_RRWEB_DATA]: () => {
            return this.rrwebQueue.value
        }
    }
}