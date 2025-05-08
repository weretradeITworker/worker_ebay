import manifest from './manifest.json';
import actions from './actions.yaml';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Language"
        }
      });
    }

    if (path === "/.well-known/ai-plugin.json") {
      return new Response(JSON.stringify(manifest), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (path === "/actions.yaml") {
      return new Response(actions, {
        headers: {
          "Content-Type": "application/yaml",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (path === "/") {
      return new Response("eBay Inventory Proxy API is running.", {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const targetUrl = "https://api.ebay.com/sell/inventory/v1" + path + url.search;

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow"
    });

    const response = await fetch(newRequest);
    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

    return modifiedResponse;
  }
};
