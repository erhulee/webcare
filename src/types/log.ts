export interface Environment {
    timestamp: number   // 客户端时间戳
    pathname: string    // 网页 url
    query: string       // 网页query字符互传
    // session_id: string  // 会话id
    ua: string          // user agent
}
export interface SniperLog {
    timestamp: number   // 客户端时间戳
    pathname: string    // 网页 url
    query: string       // 网页query字符互传
    // session_id: string  // 会话id
    ua: string          // user agent
    // 用户想要注入的信息
    extra?: {

    }
}