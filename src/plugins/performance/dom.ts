import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"

@connect
export class DOMMutationPlugin implements Plugin {
    monitor!: Monitor;
    mutation_observer: MutationObserver
    constructor() {
        this.mutation_observer = new window.MutationObserver(() => {
            console.log("dom mutation")
        })
    }
    run() {
        this.mutation_observer.observe(document.documentElement, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        })
    }
    unload() {
        this.mutation_observer.disconnect()
    }
}
