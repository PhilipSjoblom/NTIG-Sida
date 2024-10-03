function getWeek(date: Date): number {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - firstJan.getTime()) / 86400000 + firstJan.getDay() + 1) / 7);
}

async function fetchWithCheck(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response;
}

const HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    ),
    "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/json",
}

async function getSignature(classId: string): Promise<string> {
    const response = await fetchWithCheck(
        "https://web.skola24.se/api/encrypt/signature",
        {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({ signature: classId }),
        }
    );
    const json = await response.json();
    return json.data.signature;
}
async function getKey(): Promise<string> {
    const response = await fetchWithCheck(
        "https://web.skola24.se/api/get/timetable/render/key",
        {
            method: "POST",
            headers: HEADERS,
        }
    );
    const json = await response.json();
    return json.data.key;
}

async function getTimetable(classId: string): Promise<object[]> {
    const key = await getKey();
    const signature = await getSignature(classId);

    var response = await fetchWithCheck(
        "https://web.skola24.se/api/render/timetable",
        {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                "renderKey": key,
                "selection": signature,
                "week": getWeek(new Date()),
                "year": new Date().getFullYear(),
                // What's this?
                "unitGuid": "ZTEyNTdlZjItZDc3OC1mZWJkLThiYmEtOGYyZDA4NGU1YjI2",
                "host": "it-gymnasiet.skola24.se",
                "schoolYear": "71534edf-14ff-4464-af21-5ddbc3c81f5c",
                "startDate": null,
                "endDate": null,
                "scheduleDay": 0,
                "blackAndWhite": false,
                "width": 918,
                "height": 550,
                "selectionType": 4,
                "showHeader": false,
                "periodText": "",
                "privateFreeTextMode": false,
                "privateSelectionMode": null,
                "customerKey": "",
            }),
        }
    );
    response = new Response(response.body, response);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.append("Vary", "Origin");



    const json = await response.json();
    console.log(json);
    const lessonInfo = json.data?.lessonInfo;
    if (!lessonInfo) {
        throw new Error("No lesson info found");
    }
    return lessonInfo;
}

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
};


export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        if (url.pathname === "/skola24")
            return this.fetchSkola24(request);
        if (url.pathname === "/food")
            return this.fetchFood(request);

        return new Response("Not found", {
            headers: headers,
            status: 404,
        });
    },

    async fetchFood(request: Request): Promise<Response> {
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
    },

    async fetchSkola24(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const classId = url.searchParams.get("classId");
        if (!classId)
            return new Response("Missing classId", {
                headers: headers,
                status: 400,
            });
        if (request.method === "OPTIONS")
            return new Response(null, { headers: headers });

        try {
            const timetable = await getTimetable(classId);
            return new Response(JSON.stringify(timetable), {
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                }
            });
        } catch (error) {
            return new Response(
                "Failed to fetch timetable",
                {
                    headers: headers,
                    status: 500,
                }
            );
        }
    },
};