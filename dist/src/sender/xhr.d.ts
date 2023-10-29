import { Monitor } from "src/runtime";
import { SniperLog } from "src/types/log";
import { Sender } from "src/types/sender";
declare class XHRSender implements Sender {
    monitor: Monitor;
    get endpoint(): string;
    send(log: SniperLog): void;
}
export default XHRSender;
