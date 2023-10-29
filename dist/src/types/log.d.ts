export interface Environment {
    timestamp: number;
    pathname: string;
    query: string;
    ua: string;
}
export interface SniperLog {
    env?: Environment;
    extra?: {};
}
