import { Monitor } from "src/runtime";
export default function createJSErrorLogger(params: {
    stack: string;
    message: string;
}, monitor?: Monitor): {
    category: string;
    type: string;
    detail: {
        stack: string;
        message: string;
    };
};
