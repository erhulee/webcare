import { Monitor } from "src/runtime";
import { Plugin } from "../../types/plugin";
import { LimitQueue } from "src/utils/LimitQueue";
declare class JsErrorPlugin implements Plugin {
    monitor: Monitor;
    error_listener: any;
    promise_listener: any;
    run(): void;
    unload(): void;
    events(): {
        rrweb: (event: any) => void;
    };
    rrwebQueue: LimitQueue<any>;
    constructor(rrweb_size?: number);
}
export default JsErrorPlugin;
