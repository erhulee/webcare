import { GLOBAL_METHOD } from "@/runtime/global";
import { Monitor } from "../runtime";
import { AnyFunc } from "./other";

export interface Plugin {
    monitor: Monitor
    run: () => void
    unload: () => void
    /**
     * 监听的事件
     */
    events?: () => Record<string, AnyFunc>
    /**
     * 
     */
    globalMethod?: {
        [GLOBAL_METHOD.GET_RRWEB_DATA]: (...args: any[]) => any[]
    }
}