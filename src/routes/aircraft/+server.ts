import type {RequestHandler} from "@sveltejs/kit";

export const GET: RequestHandler = async ({params, url}) => {

    let lat = url.searchParams.get("lat");
    let lon = url.searchParams.get("lon");

    if (!lat || !lon) {
        return new Response(JSON.stringify({error: "Missing latitude or longitude parameters"}), {status: 400});
    }

    const ADSBFI_API_URL = "https://opendata.adsb.fi/api/v3/lat/{lat}/lon/{lon}/dist/{dist}/";


    let res = await fetch(ADSBFI_API_URL.replace("{lat}", lat).replace("{lon}", lon).replace("{dist}", "20"))
    if (!res.ok) {
        return new Response(JSON.stringify({error: "Failed to fetch data from ADS-B Exchange"}), {status: 502});
    }

    let data = await res.json();

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}