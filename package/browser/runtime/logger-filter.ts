interface LoggerFilterInput {
    category: string,
    type: string,
    detail: unknown
}
export class LoggerFilter {
    private _set: Set<string> = new Set();
    private timer: NodeJS.Timeout | null = null
    constructor() {
        this.corn()
    }
    hash(log: LoggerFilterInput): string {
        const { category, type, detail } = log;
        return `${category}_${type}_${JSON.stringify(detail)}`
    }
    validate(log: LoggerFilterInput) {
        const hash = this.hash(log)
        if (this._set.has(hash)) {
            return false
        } else {
            return true
        }
    }

    private corn() {
        this.timer = setInterval(() => {
            this._set.clear()
        }, 1000)
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
}