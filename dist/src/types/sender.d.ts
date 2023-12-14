import { SniperLog } from "./log";
import { HTTPMethod } from "./other";
export interface Sender {
    endpoint: string;
    method?: HTTPMethod;
    send: (log: SniperLog) => void;
}
