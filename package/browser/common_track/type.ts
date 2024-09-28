// 通用埋点
export type CommonTrack = {
    $event: string
    $timestamp: number,
    $pathname: string,
    $query: string,
    $ua: string
}