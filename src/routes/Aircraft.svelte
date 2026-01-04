<script lang="ts">
    import {onMount} from "svelte";

    let { ac, lat, lon }:{ac:any, lat:number, lon:number} = $props();

    const RADIUS_NM = 20; // nm


    let rot = $state(0);
    let left = $state(0);
    let top = $state(0);

    onMount(() => {
        // get parent element dimensions
        const parent = (document.querySelector('.container') as HTMLElement);
        const parentRect = parent.getBoundingClientRect();
        const parentWidth = parentRect.width;
        const parentHeight = parentRect.height;
        const PROJ_RADIUS = Math.min(parentWidth, parentHeight) / 2;

        function clamp(v:number, a:number, b:number){ return Math.max(a, Math.min(b, v)); }

        const dstNm = ac.dst ?? 0;
        const dirDeg = ac.dir ?? 0;

        const theta = (dirDeg * Math.PI) / 180;
        const xNm = Math.sin(theta) * dstNm;
        const yNm = -Math.cos(theta) * dstNm;

        const xPx = (xNm / RADIUS_NM) * PROJ_RADIUS;
        const yPx = (yNm / RADIUS_NM) * PROJ_RADIUS;

        const r = Math.hypot(xPx, yPx);
        const maxR = PROJ_RADIUS;
        const scale = r > maxR ? maxR / r : 1;

        left = PROJ_RADIUS + xPx * scale;
        top  = PROJ_RADIUS + yPx * scale;

        // Optional: rotate icon to match track (degrees from north clockwise)
        rot = ac.track ?? 0;
    })

    /**
     * Converts altitude (e.g. 6000ft) to flight level (e.g. FL60)
     * @param altFeet
     */
    function altToFlightLevel(altFeet:number):string {
        if (altFeet < 0) return 'N/A';
        return String(Math.round(altFeet / 100));
    }
</script>

<div class="aircraft" style={`left:${left}px; top:${top}px; transform: translate(-50%, -50%)`}>
    <svg style={`transform: rotate(${rot}deg);`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-80v-100l120-84v-144L80-280v-120l320-224v-176q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800v176l320 224v120L560-408v144l120 84v100l-200-60-200 60Z"/></svg>

    <p>{ac.flight}<br>
        <span class="sm">FL{altToFlightLevel(ac.alt_baro) ?? 'N/A'}<br></span>
    </p>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');

    .sm {
        font-size: 12px;
        color: #c3c3c3;
    }
    .aircraft {
        position: absolute;
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;
        color: white;
    }

    .aircraft p {
        margin: 0;
        font-family: 'Google Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #e3e3e3;
        text-shadow: 0 0 5px black;
    }


</style>