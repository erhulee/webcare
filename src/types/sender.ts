interface Sender {
    endpoint: string
    send: (log: Log) => void
}