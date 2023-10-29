import { SniperLog } from "./log";
export interface Sender {
    endpoint: string;
    send: (log: SniperLog) => void;
}
