/**
 * Cloudflare Workers entry point for Ctool
 * - Serves frontend static assets via env.ASSETS (Vue 3 SPA)
 * - Provides built-in CORS Proxy endpoint (/api/proxy) for Ctool online tools
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 跨域预检请求 (CORS OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. 内置网络跨域代理接口 (/api/proxy?url=https://...)
    if (url.pathname.startsWith("/api/proxy")) {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) {
        return new Response(JSON.stringify({ error: "Missing required query parameter: url" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      try {
        const target = new URL(targetUrl);
        const host = target.hostname.toLowerCase();

        // 安全拦截：禁止私有/内网主机访问 (SSRF 防御)
        if (
          host === "localhost" ||
          host === "127.0.0.1" ||
          host === "0.0.0.0" ||
          host === "::1" ||
          host.endsWith(".local") ||
          host.endsWith(".internal")
        ) {
          return new Response(JSON.stringify({ error: "Forbidden target host" }), {
            status: 403,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }

        const forwardHeaders = new Headers(request.headers);
        forwardHeaders.delete("host");
        forwardHeaders.delete("cf-connecting-ip");
        forwardHeaders.delete("cf-ray");
        forwardHeaders.delete("cf-visitor");

        const response = await fetch(target.toString(), {
          method: request.method,
          headers: forwardHeaders,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
          redirect: "follow",
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        responseHeaders.set("Access-Control-Allow-Headers", "*");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: `Proxy fetch failed: ${err.message}` }), {
          status: 502,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // 3. 静态前端资源分发 (支持 SPA 自动单页路由映射与资源缓存)
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    return new Response("Ctool Workers Asset Binding not found", { status: 404 });
  },
};
