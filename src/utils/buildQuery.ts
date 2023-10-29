export default function buildQuery(path: string) {
    const urlObj = new URL(path);
    return urlObj.search
}

