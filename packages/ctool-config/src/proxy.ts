// 在平台 platform.runtime.webSecurity() === true 时 需要配置代理访问的域名
const domains: string[] = []

const isPrivateHost = (hostname: string): boolean => {
    const lower = hostname.toLowerCase();
    if (
        lower === "localhost" ||
        lower.endsWith(".local") ||
        lower.endsWith(".internal") ||
        lower === "0.0.0.0" ||
        lower === "::1" ||
        lower === "127.0.0.1"
    ) {
        return true;
    }
    // IPv4 私有与本地回环地址
    const parts = lower.split(".").map(Number);
    if (parts.length === 4 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
        if (parts[0] === 10) return true; // 10.0.0.0/8
        if (parts[0] === 127) return true; // 127.0.0.0/8
        if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
        if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
    }
    return false;
};

export default {
    defaultProxyUrl: "https://web.coral.cc.cd/api/proxy",
    is(urlString: string) {
        if (!urlString) {
            return false;
        }
        try {
            const parsed = new URL(urlString);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                return false;
            }
            const hostname = parsed.hostname.toLowerCase();
            if (isPrivateHost(hostname)) {
                return false;
            }
            return domains.some(domain => {
                const targetDomain = domain.toLowerCase().trim();
                return hostname === targetDomain || hostname.endsWith(`.${targetDomain}`);
            });
        } catch {
            return false;
        }
    },
    getDomains() {
        return domains
    },
    // chrome / edge / firefox 浏览器扩展  manifest.json permissions
    getManifestPermissions() {
        return domains.map(domain => {
            domain = domain.trim();
            const lists = domain.split('.')
            if (lists.length < 2) {
                return "";
            }
            if (lists.length === 2) {
                return [`*.${domain}`, domain]
            }
            return lists.join(".");
        }).flat().filter(str => str !== "").map(str => `*://${str}/*`)
    }
}
