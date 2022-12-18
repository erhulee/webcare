import { Monitor } from "./Monitor";

export interface Plugin {
    instance: any;
    init:   Function;
    run:    Function;
    unload: Function;
}