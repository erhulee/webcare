import { Monitor } from "src/runtime";
import { SniperLog } from "src/types/log";
import { HTTPMethod } from "src/types/other";
import { Sender } from "src/types/sender";
declare class XHRSender implements Sender {
    monitor: Monitor;
    method: HTTPMethod;
    get endpoint(): string;
    constructor(method: HTTPMethod);
    send(log: SniperLog): void;
}
export default XHRSender;
