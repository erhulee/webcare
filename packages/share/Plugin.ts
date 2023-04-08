import { Monitor } from "./Monitor";

export interface Plugin {
    instance?: any;
    monitor?: any
    init: Function;
    run: Function;
    unload: Function;
}