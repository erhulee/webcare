import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"
import { onCLS, onFCP, onTTFB, onFID, onLCP, onINP } from "web-vitals";

@connect
export class WebVitalsPlugin implements Plugin {
    monitor!: Monitor;
    constructor() {

    }
    run() {
        onCLS((value) => {
            console.log("cls:", value)
        })
        onFID((value) => {
            console.log("fid:", value)
        })
        onFCP((value) => {
            console.log("fcp:", value)
        })
        onTTFB((value) => {
            console.log("ttfb:", value)
        })
        onLCP((value) => {
            console.log("lcp:", value)
        })
        onINP((value) => {
            console.log("inp:", value)
        })
    }
    unload() {
    }
}
