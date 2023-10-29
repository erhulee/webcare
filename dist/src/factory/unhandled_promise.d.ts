import { Monitor } from "src/runtime";
export default function createPromiseLogger(params: {}, monitor?: Monitor): {
    category: string;
    type: string;
    detail: {};
};
