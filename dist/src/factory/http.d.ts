import { Monitor } from "src/runtime";
export default function createHTTPErrorLogger(params: {
    method?: "get" | "post" | "delete" | "put";
    url: string;
    query?: string;
    body?: Record<string, any>;
    status: number;
    status_text: string;
}, monitor?: Monitor): {
    category: string;
    type: string;
    detail: {
        method?: "get" | "post" | "delete" | "put" | undefined;
        url: string;
        query?: string | undefined;
        body?: Record<string, any> | undefined;
        status: number;
        status_text: string;
    };
};
