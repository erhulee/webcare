import { Monitor } from "src/runtime";
import { Plugin } from "../../types/plugin";
export default class HTTPPlugin implements Plugin {
    monitor: Monitor;
    nativeXHRSend?: any;
    nativeFetch?: any;
    constructor();
    run(): void;
    unload(): void;
}
