export default function buildQuery(path: string) {
    if (path == "") return ""
    const urlObj = new URL(path);
    return urlObj.search
}

