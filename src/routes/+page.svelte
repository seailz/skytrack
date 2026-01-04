<script lang="ts">
    import {onMount} from "svelte";
    import Aircraft from "./Aircraft.svelte";

    let aircraft:any[] = $state([])

    let long:number = $state(0);
    let lat:number = $state(0);

    onMount(() => {

        let ready = false;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position => {
                long = position.coords.longitude;
                lat = position.coords.latitude;
                ready = true;
            }));
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        setInterval(() => {
            while (!ready) {
                console.log("not ready")
            } // Wait until geolocation is ready
            console.log("Fetching aircraft data...", long, lat, ready);

            fetch(`/aircraft?lat=${lat}&lon=${long}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .then(data => {
                    aircraft = data.ac;
                    console.log(aircraft);
                })
                .catch(error => {
                    console.error("Error fetching aircraft data:", error);
                });
        }, 5000);
    })
</script>

<div class="container">
    {#each aircraft as ac}
        {#if ac.alt_geom > 1000}
            <Aircraft {ac} {lat} lon={long} />
        {/if}
    {/each}
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: black;
    }

    :global(html, body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    :global(*) {
        box-sizing: border-box;
    }
</style>