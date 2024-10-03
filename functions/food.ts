import { PagesFunction } from "@cloudflare/workers-types";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
};


export const onRequest: PagesFunction = async ({ request }) => {
    if (request.method === "OPTIONS")
        return new Response(null, { headers: headers });

    const response = await fetch(
        "https://skolmaten.se/nti-gymnasiet-sodertorn/rss/days/",
    )
    if (!response.ok) {
        return new Response("Failed to fetch food", {
            headers: headers,
            status: 500,
        });
    }
    const text = await response.text();
    return new Response(text, {
        headers: {
            ...headers,
            "Content-Type": "text/html",
        }
    });
}