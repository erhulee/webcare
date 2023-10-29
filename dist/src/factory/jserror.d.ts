import { Monitor } from "src/runtime";
export default function createJSErrorLogger(params: {
    stack: string;
    message: string;
}, monitor?: Monitor): {
    stack: string;
    message: string;
    category: string;
    type: string;
};
