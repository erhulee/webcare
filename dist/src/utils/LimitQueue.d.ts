export declare class LimitQueue<T> {
    private size;
    private data;
    constructor(size: number);
    add(data: T): void;
    get value(): T[];
}
