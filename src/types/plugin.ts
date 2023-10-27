import { Monitor } from "../runtime";
import { AnyFunc } from "./other";

export interface Plugin {
    monitor: Monitor
    run: () => void
    unload: () => void
    events: () => Record<string, AnyFunc>
}